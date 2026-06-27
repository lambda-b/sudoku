export const cx = (...classes: (false | null | undefined | string)[]) => {
  return classes.filter(Boolean).join(" ");
};
