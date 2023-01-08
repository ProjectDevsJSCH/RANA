import { GAMES } from '@/db/enums/games.enum';

export interface ConfigurationStore {
  idConfig: number;
  type: GAMES;
  currentRound: number;
  currentPlayer: string;
  limitGameScore: number;
  limitGameRounds: number;
  eliminatedPlayersByRound: number;
  winner: string;
}
