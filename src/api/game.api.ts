import uniqid from 'uniqid';

import { GAMES } from '@/db/enums/games.enum';
import { dbInstance } from '@/db/initializer';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class GameApi {
  static async setNewGame(
    selectedOption: GAMES,
    value: string,
    firstPlayerId: number,
    numberOfPlayers: number,
  ): Promise<void> {
    const db = await dbInstance();

    await db.add(TABLE_STORE_CONFIG, {
      idConfig: uniqid(),
      type: selectedOption,
      currentRound: 1,
      currentPlayer: firstPlayerId,
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
    const player = await db.get(TABLE_STORE_PLAYERS, currentConfigs[0].currentPlayer) || {
      idPlayer: -1,
      name: '',
      totalScore: 0,
      rounds: [],
    };

    return player;
  }

  static async setNextTurn(score: number): Promise<PlayerStore> {
    const db = await dbInstance();
    const currentConfig = (await db.getAll(TABLE_STORE_CONFIG))[0];
    const allPlayers = await db.getAll(TABLE_STORE_PLAYERS);
    const currentPlayer = await this.getCurrentPlayer();

    // Update current player round information
    await db.put(
      TABLE_STORE_PLAYERS,
      {
        ...currentPlayer,
        rounds: [
          ...currentPlayer.rounds,
          {
            number: currentConfig.currentRound,
            score,
            played: true,
          }],
      },
    );

    const nextPlayerId = currentPlayer.idPlayer + 1 > allPlayers.length ? 1 : currentPlayer.idPlayer + 1;
    const nextPlayer = await db.get(TABLE_STORE_PLAYERS, nextPlayerId);

    // Update current player in config store
    // Update current round in config store
    if (nextPlayer) {
      const roundUpdate = nextPlayerId === 1 ? currentConfig.currentRound + 1 : currentConfig.currentRound;

      await db.put(
        TABLE_STORE_CONFIG,
        {
          ...currentConfig,
          currentRound: roundUpdate,
          currentPlayer: nextPlayer.idPlayer,
        },
      );

      return nextPlayer;
    }

    // Flag of game is finished
    return {
      idPlayer: -1,
      name: '',
      totalScore: 0,
      rounds: [],
    };
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();
    await db.clear(TABLE_STORE_CONFIG);
  }
}
