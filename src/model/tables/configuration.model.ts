import { GAMES } from '@/db/enums/games.enum';

export const TABLE_STORE_CONFIG = 'configuration';

export interface ConfigurationStore {
  idConfig: string;
  type: GAMES;
  currentRound: number;
  currentPlayer: number;
  totalPlayers: number;
  limitGameScore: number;
  limitGameRounds: number;
  eliminatedPlayersByRound: number;
  winner: string;
}
