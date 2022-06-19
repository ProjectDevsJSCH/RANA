interface Round {
  number: number;
  score: number;
  played: boolean;
}

export interface PlayerStore {
  idPlayer: number;
  name: string;
  totalScore: number;
  rounds: Round[];
}
