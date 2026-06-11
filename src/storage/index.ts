import { LocalStorageImpl } from './localStorage';
import type { FlapStorage } from './types';

export type { FlapStorage };

let activeStorage: FlapStorage = new LocalStorageImpl();

export function getStorage(): FlapStorage {
  return activeStorage;
}

export function setStorage(impl: FlapStorage): void {
  activeStorage = impl;
}
