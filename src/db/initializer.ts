import { IDBPDatabase, openDB } from 'idb';

import {
  DB_NAME,
  DB_VERSION,
} from '@/constants/db.constants';
import { DBModel } from '@/model/db.model';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

let cachedDb: IDBPDatabase<DBModel> | null = null;

export const dbInitializer = async (): Promise<IDBPDatabase<DBModel>> => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB');
  }

  if (cachedDb) {
    return cachedDb;
  }

  cachedDb = await openDB<DBModel>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_STORE_PLAYERS)) {
        const playersStore = db.createObjectStore(TABLE_STORE_PLAYERS, {
          keyPath: 'idPlayer',
        });

        playersStore.createIndex('byPosition', 'position', { unique: true });
      }
      if (!db.objectStoreNames.contains(TABLE_STORE_CONFIG)) {
        db.createObjectStore(TABLE_STORE_CONFIG, {
          keyPath: 'idConfig',
        });
      }
    },
  });

  return cachedDb;
};

export async function dbInstance(): Promise<IDBPDatabase<DBModel>> {
  if (cachedDb) {
    return cachedDb;
  }

  return dbInitializer();
}
