import { DBSchema } from 'idb';

import { TABLE_STORE_CONFIG, TABLE_STORE_PLAYERS } from '@/constants/db.constants';

import { ConfigurationStore } from './configuration.model';
import { PlayerStore } from './player.model';

export interface DBModel extends DBSchema {
  [TABLE_STORE_PLAYERS]: {
    key: number;
    value: PlayerStore;
  },
  [TABLE_STORE_CONFIG]: {
    key: number;
    value: ConfigurationStore
  }
}
