interface Round {
  number: number;
  score: number;
  played: boolean;
}

export const TABLE_STORE_PLAYERS = 'players';

export interface PlayerStore {
  idPlayer: string;
  name: string;
  position: number;
  totalScore: number;
  rounds: Round[];
}
