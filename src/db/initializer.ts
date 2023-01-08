import { IDBPDatabase, openDB } from 'idb';

import {
  DB_NAME,
  DB_VERSION,
} from '@/constants/db.constants';
import { DBModel } from '@/model/db.model';
import { TABLE_STORE_CONFIG } from '@/model/tables/configuration.model';
import { TABLE_STORE_PLAYERS } from '@/model/tables/player.model';

export const dbInitializer = async (): Promise<IDBPDatabase<DBModel>> => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB');
  }

  return openDB<DBModel>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_STORE_PLAYERS)) {
        db.createObjectStore(TABLE_STORE_PLAYERS, {
          keyPath: 'idPlayer',
        });
      }
      if (!db.objectStoreNames.contains(TABLE_STORE_CONFIG)) {
        db.createObjectStore(TABLE_STORE_CONFIG, {
          keyPath: 'idConfig',
        });
      }
    },
  });
};

export async function dbInstance(): Promise<IDBPDatabase<DBModel>> {
  return openDB<DBModel>(DB_NAME, DB_VERSION);
}
