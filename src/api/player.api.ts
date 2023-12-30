import { PlayerInformation } from '@/components/players-list/player-information.interface';
import { dbInstance } from '@/db/initializer';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class PlayerApi {
  static async addPlayers(
    players: PlayerInformation[],
  ): Promise<void> {
    const db = await dbInstance();
    const tx = db.transaction(TABLE_STORE_PLAYERS, 'readwrite');

    await Promise.all(
      [
        ...players.map((player) => tx.store.add({
          idPlayer: player.idPlayer,
          name: player.name,
          position: player.position,
          totalScore: 0,
          rounds: [],
        })),
        tx.done,
      ],
    );
  }

  static async getAllPlayers(): Promise<PlayerStore[]> {
    const db = await dbInstance();
    const allPlayers = await db.getAll(TABLE_STORE_PLAYERS);

    return allPlayers.sort((a, b) => a.position - b.position);
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();

    await db.clear(TABLE_STORE_PLAYERS);
  }

  static async updatePlayerName(
    playerId: string,
    playerName: string,
  ): Promise<void> {
    const db = await dbInstance();
    const player = await db.get(TABLE_STORE_PLAYERS, playerId);
    const gamePlayerInfo = await db.getAll(TABLE_STORE_CONFIG);

    if (player) {
      player.name = playerName;
      gamePlayerInfo[0].currentPlayer.name = playerName;

      await db.put(TABLE_STORE_PLAYERS, player);
      await db.put(TABLE_STORE_CONFIG, gamePlayerInfo[0]);
    }
  }

  static async updatePlayerRoundScore(
    idPlayer: string,
    idRound: number,
    score: number,
  ): Promise<void> {
    const db = await dbInstance();
    const player = await db.get(TABLE_STORE_PLAYERS, idPlayer);

    if (player?.name) {
      const playerRound = player.rounds.find((round) => round.number === idRound && round.played);

      if (playerRound) {
        playerRound.score = score;
      }

      player.totalScore = player.rounds.reduce((acc, round) => acc + round.score, 0);

      await db.put(TABLE_STORE_PLAYERS, player);
    }
  }
}
