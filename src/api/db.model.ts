import { DBSchema } from 'idb';

import { DB_STORE_CONFIG, DB_STORE_GAME } from '@/constants/db.constants';

import { ConfigurationStore } from '../model/configuration.model';
import { GameStore } from '../model/game.model';

export interface DBModel extends DBSchema {
  [DB_STORE_GAME]: {
    key: number;
    value: GameStore;
  },
  [DB_STORE_CONFIG]: {
    key: number;
    value: ConfigurationStore
  }
}
