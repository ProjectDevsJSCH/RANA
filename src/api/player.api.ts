import { dbInstance } from '@/db/initializer';
import { PlayerInformation } from '@/model/player-information.model';
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
    const tx = db.transaction([TABLE_STORE_PLAYERS, TABLE_STORE_CONFIG], 'readwrite');
    const playersStore = tx.objectStore(TABLE_STORE_PLAYERS);
    const configStore = tx.objectStore(TABLE_STORE_CONFIG);

    const player = await playersStore.get(playerId);
    const allConfigs = await configStore.getAll();

    if (player && allConfigs.length > 0) {
      player.name = playerName;
      allConfigs[0].currentPlayer.name = playerName;

      await playersStore.put(player);
      await configStore.put(allConfigs[0]);
    }

    await tx.done;
  }

  static async updatePlayerRoundScore(
    idPlayer: string,
    idRound: number,
    score: number,
  ): Promise<void> {
    const db = await dbInstance();
    const tx = db.transaction([TABLE_STORE_PLAYERS, TABLE_STORE_CONFIG], 'readwrite');
    const playersStore = tx.objectStore(TABLE_STORE_PLAYERS);
    const configStore = tx.objectStore(TABLE_STORE_CONFIG);

    const player = await playersStore.get(idPlayer);
    const allConfigs = await configStore.getAll();

    if (player?.name) {
      const playerRound = player.rounds.find((round) => round.number === idRound && round.played);

      if (playerRound) {
        playerRound.score = score;
      }

      player.totalScore = player.rounds.reduce((acc, round) => acc + round.score, 0);

      await playersStore.put(player);
    }

    if (allConfigs.length > 0 && allConfigs[0].currentPlayer.idPlayer === idPlayer && player) {
      allConfigs[0].currentPlayer = player;

      await configStore.put(allConfigs[0]);
    }

    await tx.done;
  }
}
