import { uniqueId } from 'lodash';

import { GAMES } from '@/db/enums/games.enum';
import { dbInstance } from '@/db/initializer';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class GameApi {
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

  static async checkGameWinner(): Promise<string> {
    const { db, config } = await GameApi.getConfig();
    const {
      type, limitGameScore, limitGameRounds, eliminatedPlayersByRound,
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

    if (type === GAMES.PLAYOFFS && config.currentRound > eliminatedPlayersByRound) {
      const players = await db.getAll(TABLE_STORE_PLAYERS);
      winner = players.reduce((prev, current) => (prev.totalScore > current.totalScore ? prev : current));
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
