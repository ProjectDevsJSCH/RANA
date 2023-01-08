interface Round {
  number: number;
  score: number;
  played: boolean;
}

export const TABLE_STORE_PLAYERS = 'players';

export interface PlayerStore {
  idPlayer: number;
  name: string;
  totalScore: number;
  rounds: Round[];
}
