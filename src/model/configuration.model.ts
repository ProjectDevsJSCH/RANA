import { GAMES } from '@/db/enums/games.enum';

export interface ConfigurationStore {
  idConfig: number;
  type: GAMES;
  currentPlayer: string;
  limitGameScore: number;
  limitGameRounds: number;
  eliminatedPlayersByRound: number;
  winner: string;
}
