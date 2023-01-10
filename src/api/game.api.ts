import { uniqueId } from 'lodash';

import { GAMES } from '@/db/enums/games.enum';
import { dbInstance } from '@/db/initializer';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class GameApi {
  static async checkIfGameIsPlaying(): Promise<boolean> {
    const db = await dbInstance();
    const currentConfigs = await db.getAll(TABLE_STORE_CONFIG);

    return currentConfigs.length > 0;
  }

  static async setNewGame(
    selectedOption: GAMES,
    value: string,
    numberOfPlayers: number,
  ): Promise<void> {
    const db = await dbInstance();

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
      limitGameScore: selectedOption === GAMES.SCORE_LIMIT ? +value : 0,
      limitGameRounds: selectedOption === GAMES.ROUND_LIMIT ? +value : 0,
      eliminatedPlayersByRound: selectedOption === GAMES.PLAYOFFS ? +value : 0,
      winner: '',
    });
  }

  static async getCurrentPlayer(): Promise<PlayerStore> {
    const db = await dbInstance();
    const currentConfigs = await db.getAll(TABLE_STORE_CONFIG);

    return currentConfigs[0].currentPlayer;
  }

  static async getCurrentRound(): Promise<number> {
    const db = await dbInstance();
    const currentConfigs = await db.getAll(TABLE_STORE_CONFIG);

    return currentConfigs[0].currentRound;
  }

  static async setNextTurn(score: number): Promise<PlayerStore> {
    const db = await dbInstance();
    const currentConfig = (await db.getAll(TABLE_STORE_CONFIG))[0];
    const { currentPlayer } = currentConfig;

    // Update current player round information
    await db.put(
      TABLE_STORE_PLAYERS,
      {
        ...currentPlayer,
        totalScore: currentPlayer.totalScore + score,
        rounds: [
          ...currentPlayer.rounds,
          {
            number: currentConfig.currentRound,
            score,
            played: true,
          }],
      },
    );

    const nextPlayer = await db.getFromIndex(TABLE_STORE_PLAYERS, 'byPosition', currentPlayer.position + 1)
      || await db.getFromIndex(TABLE_STORE_PLAYERS, 'byPosition', 1);

    // Update current player in config store
    // Update current round in config store
    if (nextPlayer) {
      const roundUpdate = nextPlayer.position === 1 ? currentConfig.currentRound + 1 : currentConfig.currentRound;

      await db.put(
        TABLE_STORE_CONFIG,
        {
          ...currentConfig,
          currentRound: roundUpdate,
          currentPlayer: nextPlayer,
        },
      );

      return nextPlayer;
    }

    // Flag of game is finished
    return {
      idPlayer: '',
      name: '',
      position: -1,
      totalScore: 0,
      rounds: [],
    };
  }

  static async getNextPlayerName(): Promise<string | undefined> {
    const db = await dbInstance();
    const currentConfig = (await db.getAll(TABLE_STORE_CONFIG))[0];
    const { currentPlayer } = currentConfig;

    const nextPlayer = await db.getFromIndex(TABLE_STORE_PLAYERS, 'byPosition', currentPlayer.position + 1);

    return nextPlayer?.name || undefined;
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();
    await db.clear(TABLE_STORE_CONFIG);
  }
}
