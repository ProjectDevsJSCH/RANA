export interface ConfigurationStore {
  currentUrl: string;
  type: string;
  currentPlayer: string;
  limitGameScore: number;
  limitGameRounds: number;
  eliminatedPlayers: number;
  winner: string;
}
