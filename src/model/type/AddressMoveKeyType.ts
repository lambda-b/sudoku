export const ADDRESS_MOVE_KEYS = [
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Escape",
] as const;

export type AddressMoveKeyType = typeof ADDRESS_MOVE_KEYS[number];

export const isAddressMoveKeyType = (param: string) => ADDRESS_MOVE_KEYS.includes(param as AddressMoveKeyType);
