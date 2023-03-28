import { IdObject, IdType } from "@/utility/model/IdObject";

interface Pair<K, V> {
  key: K;
  value: V;
}

export class IdMap<K extends IdObject, V> implements Map<K, V> {
  private _map: Map<IdType, Pair<K, V>>;

  constructor() {
    this._map = new Map();
  }

  clear(): void {
    this._map.clear();
  }
  delete(key: K): boolean {
    return this._map.delete(key.id);
  }
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    const callbackfnForId = (
      entry: Pair<K, V>,
      id: IdType,
      map: Map<IdType, Pair<K, V>>,
    ) => callbackfn(entry.value, entry.key, this);
    this._map.forEach(callbackfnForId, thisArg);
  }
  get(key: K): V | undefined {
    return this._map.get(key.id)?.value;
  }
  has(key: K): boolean {
    return this._map.has(key.id);
  }
  set(key: K, value: V): this {
    this._map.set(key.id, { key, value });
    return this;
  }
  get size(): number {
    return this._map.size;
  }
  *entries(): IterableIterator<[K, V]> {
    const entries = this._map.values();
    for (const pair of entries) {
      yield [pair.key, pair.value];
    }
  }
  *keys(): IterableIterator<K> {
    const entries = this._map.values();
    for (const pair of entries) {
      yield pair.key;
    }
  }
  *values(): IterableIterator<V> {
    const entries = this._map.values();
    for (const pair of entries) {
      yield pair.value;
    }
  }
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
  get [Symbol.toStringTag](): string {
    return "IdMap";
  };
}
