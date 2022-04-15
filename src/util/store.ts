import { HVULAPI } from '../types';

export async function getValue<T extends keyof HVULAPI.StoredValue>(key: T): Promise<HVULAPI.StoredValue[T] | undefined | null> {
  return GM.getValue(key);
}

export async function setValue<T extends keyof HVULAPI.StoredValue>(key: T, value: HVULAPI.StoredValue[T]): Promise<void> {
  return GM.setValue(key, value);
}

export async function removeValue(key: keyof HVULAPI.StoredValue): Promise<void> {
  return GM.deleteValue(key);
}
