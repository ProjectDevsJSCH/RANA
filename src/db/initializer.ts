import { IDBPDatabase, openDB } from 'idb';

import {
  DB_NAME,
  TABLE_STORE_CONFIG,
  TABLE_STORE_PLAYERS,
  DB_VERSION,
} from '@/constants/db.constants';
import { DBModel } from '@/model/db.model';

export const dbInitializer = async (): Promise<IDBPDatabase<DBModel>> => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB');
  }

  return openDB<DBModel>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_STORE_PLAYERS)) {
        db.createObjectStore(TABLE_STORE_PLAYERS, {
          keyPath: 'idPlayer',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(TABLE_STORE_CONFIG)) {
        db.createObjectStore(TABLE_STORE_CONFIG, {
          keyPath: 'idConfig',
          autoIncrement: true,
        });
      }
    },
  });
};

export async function dbInstance(): Promise<IDBPDatabase<unknown>> {
  return openDB(DB_NAME, 1);
}
