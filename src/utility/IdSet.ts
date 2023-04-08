import { IdObject, IdType } from "@/utility/model/IdObject";

export class IdSet<E extends IdObject> implements Set<E> {
  private _map: Map<IdType, E>;

  constructor() {
    this._map = new Map<IdType, E>;
  }
  add(value: E): this {
    this._map.set(value.id, value);
    return this;
  }
  clear(): void {
    this._map.clear();
  }
  delete(value: E): boolean {
    return this._map.delete(value.id);
  }
  forEach(callbackfn: (value: E, value2: E, set: Set<E>) => void, thisArg?: any): void {
    const callbackfnForId = (
      value: E,
      key: IdType,
      map: Map<IdType, E>,
    ) => callbackfn(value, value, this);
    this._map.forEach(callbackfnForId, thisArg);
  }

  has(value: E): boolean {
    return this._map.has(value.id);
  }

  get size() {
    return this._map.size;
  }

  *entries(): IterableIterator<[E, E]> {
    const values = this._map.values();
    for (const value of values) {
      yield [value, value];
    }
  }
  *keys(): IterableIterator<E> {
    const values = this._map.values();
    for (const value of values) {
      yield value;
    }
  }
  *values(): IterableIterator<E> {
    const values = this._map.values();
    for (const value of values) {
      yield value;
    }
  }

  *[Symbol.iterator](): IterableIterator<E> {
    const values = this._map.values();
    for (const value of values) {
      yield value;
    }
  }
  get [Symbol.toStringTag]() {
    return "IdSet";
  }
}
