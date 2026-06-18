import type { IdObject, IdType } from "@/utility/model/IdObject";

interface Pair<K, V> {
  key: K;
  value: V;
}

export class IdMap<K extends IdObject, V> implements Map<K, V> {
  #map: Map<IdType, Pair<K, V>>;

  constructor() {
    this.#map = new Map();
  }

  clear(): void {
    this.#map.clear();
  }
  delete(key: K): boolean {
    return this.#map.delete(key.id);
  }
  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown,
  ): void {
    const callbackfnForId = (entry: Pair<K, V>) =>
      callbackfn(entry.value, entry.key, this);
    this.#map.forEach(callbackfnForId, thisArg);
  }
  get(key: K): V | undefined {
    return this.#map.get(key.id)?.value;
  }
  has(key: K): boolean {
    return this.#map.has(key.id);
  }
  set(key: K, value: V): this {
    this.#map.set(key.id, { key, value });
    return this;
  }
  get size(): number {
    return this.#map.size;
  }
  *entries(): MapIterator<[K, V]> {
    const entries = this.#map.values();
    for (const pair of entries) {
      yield [pair.key, pair.value];
    }
  }
  *keys(): MapIterator<K> {
    const entries = this.#map.values();
    for (const pair of entries) {
      yield pair.key;
    }
  }
  *values(): MapIterator<V> {
    const entries = this.#map.values();
    for (const pair of entries) {
      yield pair.value;
    }
  }
  [Symbol.iterator](): MapIterator<[K, V]> {
    return this.entries();
  }
  get [Symbol.toStringTag](): string {
    return "IdMap";
  }
}
