import { GAMES } from '@/db/enums/games.enum';

interface Round {
  number: number;
  score: number;
  played: boolean;
}

export interface GameStore {
  idPlayer: number;
  typeGame: GAMES;
  totalScore: number;
  rounds: Round[];
}
