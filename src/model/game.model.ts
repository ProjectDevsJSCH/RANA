interface Round {
  number: number;
  score: number;
  played: boolean;
}

export interface GameStore {
  idPlayer: number;
  name: string;
  totalScore: number;
  rounds: Round[];
}
