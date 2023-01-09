import { PlayerInformation } from '@/components/players-list/player-information.interface';
import { dbInstance } from '@/db/initializer';
import { PlayerStore, TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class PlayerApi {
  static async addPlayers(players: PlayerInformation[]): Promise<void> {
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
}
