export type IdType = string | number;

export interface IdObject {
  id: IdType;
}

export const equals = <T extends IdObject>(self: T, obj: Object) => {
  if (this === obj) {
    return true;
  }
  if (obj == null) {
    return false;
  }
  if (self.constructor.name !== obj.constructor.name) {
    return false;
  }

  const other = obj as T;
  return self.id === other.id;
};
