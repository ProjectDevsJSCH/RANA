import { uniqueId } from 'lodash';

import { GAMES } from '@/db/enums/games.enum';
import { dbInstance } from '@/db/initializer';
import { RoundNotice, TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class GameApi {
  private static getScoreByRound(player: PlayerStore, roundNumber: number): number {
    const playerRound = player.rounds.find((round) => round.number === roundNumber);

    return playerRound?.score ?? 0;
  }

  private static comparePlayersForElimination(
    a: PlayerStore,
    b: PlayerStore,
    currentRound: number,
  ): number {
    for (let round = currentRound; round >= 1; round -= 1) {
      const scoreA = GameApi.getScoreByRound(a, round);
      const scoreB = GameApi.getScoreByRound(b, round);

      if (scoreA !== scoreB) {
        // Lower score is eliminated first.
        return scoreA - scoreB;
      }
    }

    // Final tiebreaker: deterministic by id.
    return a.idPlayer.localeCompare(b.idPlayer);
  }

  private static getPlayersToEliminate(
    players: PlayerStore[],
    eliminatedPlayersByRound: number,
    currentRound: number,
  ): { playersToEliminate: PlayerStore[]; tieBreakPlayers: PlayerStore[] } {
    const maxEliminations = Math.min(eliminatedPlayersByRound, players.length - 1);

    if (maxEliminations <= 0) {
      return { playersToEliminate: [], tieBreakPlayers: [] };
    }

    const sortedByScore = [...players].sort((a, b) => a.totalScore - b.totalScore);
    const playersToEliminate: PlayerStore[] = [];
    let tieBreakPlayers: PlayerStore[] = [];
    let index = 0;

    while (index < sortedByScore.length && playersToEliminate.length < maxEliminations) {
      const currentScore = sortedByScore[index].totalScore;
      const tiedGroup: PlayerStore[] = [];

      while (index < sortedByScore.length && sortedByScore[index].totalScore === currentScore) {
        tiedGroup.push(sortedByScore[index]);
        index += 1;
      }

      const remainingSlots = maxEliminations - playersToEliminate.length;

      if (tiedGroup.length <= remainingSlots) {
        playersToEliminate.push(...tiedGroup);
      } else {
        // Tie in the elimination cut: apply round-based tiebreaker.
        const resolvedTiedGroup = [...tiedGroup]
          .sort((a, b) => GameApi.comparePlayersForElimination(a, b, currentRound));
        tieBreakPlayers = resolvedTiedGroup;

        playersToEliminate.push(...resolvedTiedGroup.slice(0, remainingSlots));
      }
    }

    return { playersToEliminate, tieBreakPlayers };
  }

  static async checkIfGameIsPlaying(): Promise<boolean> {
    const db = await dbInstance();
    const count = await db.count(TABLE_STORE_CONFIG);

    return count > 0;
  }

  static async setNewGame(
    selectedOption: GAMES,
    value: string,
    numberOfPlayers: number,
  ): Promise<void> {
    const db = await dbInstance();
    const parsedValue = Number.parseInt(value, 10);
    const safeValue = Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;

    const firstPlayer = await db.getFromIndex(TABLE_STORE_PLAYERS, 'byPosition', 1) || {
      idPlayer: '-1',
      name: 'null',
      position: -1,
      totalScore: -1,
      rounds: [],
    };

    await db.add(TABLE_STORE_CONFIG, {
      idConfig: uniqueId(),
      type: selectedOption,
      currentRound: 1,
      lastProcessedRoundForPlayoffs: 0,
      lastRoundNotice: {
        eliminatedPlayers: [],
        tieBreakPlayers: [],
        roundNumber: 0,
      },
      currentPlayer: firstPlayer,
      totalPlayers: numberOfPlayers,
      limitGameScore: selectedOption === GAMES.SCORE_LIMIT ? safeValue : 0,
      limitGameRounds: selectedOption === GAMES.ROUND_LIMIT ? safeValue : 0,
      eliminatedPlayersByRound: selectedOption === GAMES.PLAYOFFS ? safeValue : 0,
      winner: '',
    });
  }

  private static async getConfig(): Promise<{ db: Awaited<ReturnType<typeof dbInstance>>; config: import('@/model/tables/configuration.model').ConfigurationStore }> {
    const db = await dbInstance();
    const configs = await db.getAll(TABLE_STORE_CONFIG);

    if (!configs.length) {
      throw new Error('No hay configuración de juego activa');
    }

    return { db, config: configs[0] };
  }

  static async getCurrentPlayer(): Promise<PlayerStore> {
    const { config } = await GameApi.getConfig();

    return config.currentPlayer;
  }

  static async getCurrentRound(): Promise<number> {
    const { config } = await GameApi.getConfig();

    return config.currentRound;
  }

  static async setNextTurn(
    score: number,
  ): Promise<PlayerStore> {
    const db = await dbInstance();
    const tx = db.transaction([TABLE_STORE_PLAYERS, TABLE_STORE_CONFIG], 'readwrite');
    const playersStore = tx.objectStore(TABLE_STORE_PLAYERS);
    const configStore = tx.objectStore(TABLE_STORE_CONFIG);

    const allConfigs = await configStore.getAll();
    const currentConfig = allConfigs[0];
    const { currentPlayer } = currentConfig;

    // Update current player round information
    await playersStore.put({
      ...currentPlayer,
      totalScore: currentPlayer.totalScore + score,
      rounds: [
        ...currentPlayer.rounds,
        {
          number: currentConfig.currentRound,
          score,
          played: true,
        },
      ],
    });

    const nextPlayer = await playersStore.index('byPosition').get(currentPlayer.position + 1)
      || await playersStore.index('byPosition').get(1);

    if (nextPlayer) {
      const roundUpdate = nextPlayer.position === 1
        ? currentConfig.currentRound + 1
        : currentConfig.currentRound;

      await configStore.put({
        ...currentConfig,
        currentRound: roundUpdate,
        currentPlayer: nextPlayer,
      });

      await tx.done;

      return nextPlayer;
    }

    await tx.done;

    // Flag: game is finished
    return {
      idPlayer: '',
      name: '',
      position: -1,
      totalScore: 0,
      rounds: [],
    };
  }

  static async getNextPlayerName(): Promise<string | undefined> {
    const { db, config } = await GameApi.getConfig();
    const { currentPlayer } = config;
    const nextPlayer = await db.getFromIndex(TABLE_STORE_PLAYERS, 'byPosition', currentPlayer.position + 1);

    return nextPlayer?.name || undefined;
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();

    await db.clear(TABLE_STORE_CONFIG);
  }

  static async getLastRoundNotice(): Promise<RoundNotice> {
    const { config } = await GameApi.getConfig();

    return config.lastRoundNotice || {
      eliminatedPlayers: [],
      tieBreakPlayers: [],
      roundNumber: 0,
    };
  }

  static async checkGameWinner(): Promise<string> {
    const { db, config } = await GameApi.getConfig();
    const {
      type,
      limitGameScore,
      limitGameRounds,
      eliminatedPlayersByRound,
      lastProcessedRoundForPlayoffs = 0,
    } = config;

    let winner: PlayerStore | undefined;

    if (type === GAMES.SCORE_LIMIT) {
      const players = await db.getAll(TABLE_STORE_PLAYERS);
      [winner] = players
        .filter((player) => player.totalScore >= limitGameScore)
        .sort((a, b) => b.totalScore - a.totalScore);
    }

    if (type === GAMES.ROUND_LIMIT && config.currentRound > limitGameRounds) {
      const players = await db.getAll(TABLE_STORE_PLAYERS);
      winner = players.reduce((prev, current) => (prev.totalScore > current.totalScore ? prev : current));
    }

    if (type === GAMES.PLAYOFFS) {
      const players = await db.getAll(TABLE_STORE_PLAYERS);
      const finishedRound = config.currentRound - 1;

      if (players.length <= 1) {
        [winner] = players;
      } else if (finishedRound > lastProcessedRoundForPlayoffs) {
        const { playersToEliminate, tieBreakPlayers } = GameApi.getPlayersToEliminate(
          players,
          eliminatedPlayersByRound,
          finishedRound,
        );
        const eliminatedIds = new Set(playersToEliminate.map((player) => player.idPlayer));
        const survivors = players
          .filter((player) => !eliminatedIds.has(player.idPlayer))
          .sort((a, b) => a.position - b.position)
          .map((player, index) => ({ ...player, position: index + 1 }));

        const tx = db.transaction([TABLE_STORE_PLAYERS, TABLE_STORE_CONFIG], 'readwrite');
        const playersStore = tx.objectStore(TABLE_STORE_PLAYERS);
        const configStore = tx.objectStore(TABLE_STORE_CONFIG);

        await Promise.all(playersToEliminate.map((player) => playersStore.delete(player.idPlayer)));
        await Promise.all(survivors.map((player) => playersStore.put(player)));

        const [firstSurvivor] = survivors;
        const nextWinner = survivors.length === 1 ? firstSurvivor : undefined;

        await configStore.put({
          ...config,
          currentPlayer: firstSurvivor,
          totalPlayers: survivors.length,
          lastProcessedRoundForPlayoffs: finishedRound,
          lastRoundNotice: {
            eliminatedPlayers: playersToEliminate.map((player) => player.name),
            tieBreakPlayers: tieBreakPlayers.map((player) => player.name),
            roundNumber: finishedRound,
          },
          winner: nextWinner?.name || '',
        });

        await tx.done;

        if (nextWinner) {
          return nextWinner.name;
        }

        return '';
      }
    }

    if (winner) {
      await db.put(TABLE_STORE_CONFIG, {
        ...config,
        winner: winner.name,
      });

      return winner.name;
    }

    return '';
  }
}
