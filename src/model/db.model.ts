import { DBSchema } from 'idb';

import { ConfigurationStore, TABLE_STORE_CONFIG } from './tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from './tables/player.model';

export interface DBModel extends DBSchema {
  [TABLE_STORE_PLAYERS]: {
    key: number;
    value: PlayerStore;
  };
  [TABLE_STORE_CONFIG]: {
    key: number;
    value: ConfigurationStore;
  };
}
