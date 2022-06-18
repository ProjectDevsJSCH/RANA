import { openDB } from 'idb';

import { DBModel } from '@/api/db.model';
import {
  DB_NAME,
  DB_STORE_CONFIG,
  DB_STORE_GAME,
  DB_VERSION,
} from '@/constants/db.constants';

const dbPromise = async () => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB');
  }

  return openDB<DBModel>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DB_STORE_GAME)) {
        db.createObjectStore(DB_STORE_GAME, {
          keyPath: 'idPlayer',
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(DB_STORE_CONFIG)) {
        db.createObjectStore(DB_STORE_CONFIG, {
          keyPath: 'idConfig',
          autoIncrement: true,
        });
      }
    },
  });
};

export default dbPromise;
