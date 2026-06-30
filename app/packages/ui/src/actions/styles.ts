export const toolbarButtonClassName =
  "inline-flex items-center gap-1 rounded border px-2 py-1.5 text-xs font-medium transition-colors disabled:cursor-wait disabled:opacity-60 sm:gap-2 sm:px-4 sm:py-2 sm:text-base";

export const toolbarButtonToneClassName = {
  cyan: "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
  emerald: "border-emerald-600 text-emerald-700 hover:bg-emerald-50",
  red: "border-red-600 text-red-600 hover:bg-red-50",
  zinc: "border-zinc-600 text-zinc-700 hover:bg-zinc-50",
} as const;
