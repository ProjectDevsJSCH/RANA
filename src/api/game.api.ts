import uniqid from 'uniqid';

import { TABLE_STORE_CONFIG } from '@/constants/db.constants';
import { GAMES } from '@/db/enums/games.enum';
import { dbInstance } from '@/db/initializer';

export class GameApi {
  static async setNewGame(selectedOption: GAMES, value: string) {
    console.log(selectedOption, GAMES.ROUND_LIMIT, value);
    const db = await dbInstance();
    db.add(TABLE_STORE_CONFIG, {
      idConfig: uniqid(),
      type: selectedOption,
      currentPlayer: '',
      limitGameScore: selectedOption === GAMES.SCORE_LIMIT ? value : 0,
      limitGameRounds: selectedOption === GAMES.ROUND_LIMIT ? value : 0,
      eliminatedPlayersByRound: selectedOption === GAMES.PLAYOFFS ? value : 0,
      winner: '',
    });
  }
}
