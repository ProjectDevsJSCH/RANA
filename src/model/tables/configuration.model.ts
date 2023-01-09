import { GAMES } from '@/db/enums/games.enum';

import { PlayerStore } from './player.model';

export const TABLE_STORE_CONFIG = 'configuration';

export interface ConfigurationStore {
  idConfig: string;
  type: GAMES;
  currentRound: number;
  currentPlayer: PlayerStore;
  totalPlayers: number;
  limitGameScore: number;
  limitGameRounds: number;
  eliminatedPlayersByRound: number;
  winner: string;
}
