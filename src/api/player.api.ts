import { PlayerInformation } from '@/components/players-list/interface';
import { dbInstance } from '@/db/initializer';
import { TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export class PlayerApi {
  static async addPlayers(players: PlayerInformation[]): Promise<void> {
    const db = await dbInstance();
    const tx = db.transaction(TABLE_STORE_PLAYERS, 'readwrite');

    await Promise.all(
      [
        ...players.map((player) => tx.store.add({
          idPlayer: player.playerId,
          name: player.name,
          totalScore: 0,
          rounds: [],
        })),
        tx.done,
      ],
    );
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();
    await db.clear(TABLE_STORE_PLAYERS);
  }
}
