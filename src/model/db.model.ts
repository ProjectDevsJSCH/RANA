import { DBSchema } from 'idb';

import { ConfigurationStore, TABLE_STORE_CONFIG } from './tables/configuration.model';
import { PlayerStore, TABLE_STORE_PLAYERS } from './tables/player.model';

export interface DBModel extends DBSchema {
  [TABLE_STORE_PLAYERS]: {
    key: string;
    value: PlayerStore;
    indexes: {
      byPosition: number
    };
  };
  [TABLE_STORE_CONFIG]: {
    key: string;
    value: ConfigurationStore;
  };
}
