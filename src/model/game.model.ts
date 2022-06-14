interface Round {
  number: number;
  score: number;
  played: boolean;
}

export interface GameStore {
  name: string;
  totalScore: number;
  rounds: Round[];
}
