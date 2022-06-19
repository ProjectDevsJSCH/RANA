import { PlayerInformation } from '@/components/players-list/interface';
import { TABLE_STORE_PLAYERS } from '@/constants/db.constants';
import { dbInstance } from '@/db/initializer';

export class PlayerApi {
  static async addPlayers(players: PlayerInformation[]): Promise<void> {
    const db = await dbInstance();
    const tx = db.transaction(TABLE_STORE_PLAYERS, 'readwrite');
    const additionPool = [];

    players.forEach((player) => {
      additionPool.push(tx.store.add({
        idPlayer: player.playerId,
        name: player.name,
        totalScore: 0,
        rounds: [],
      }));
    });

    additionPool.push(tx.done);

    await Promise.all(additionPool);
  }

  static async cleanData(): Promise<void> {
    const db = await dbInstance();
    await db.clear(TABLE_STORE_PLAYERS);
  }
}
