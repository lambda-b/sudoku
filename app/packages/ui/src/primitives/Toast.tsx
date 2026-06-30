import { Button } from "@sudoku/ui/primitives/Button";
import { clsx } from "clsx";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type ToastTone = "success" | "error" | "neutral" | "info";

type ToastProps = {
  active: boolean | string | number;
  children: ReactNode;
  closeLabel?: string;
  durationSeconds?: number;
  onClose?: () => void;
  tone?: ToastTone;
};

type ToastContent = {
  children: ReactNode;
  tone: ToastTone;
};

const toneClassNames: Record<ToastTone, string> = {
  success: "border-emerald-200 text-emerald-800",
  error: "border-red-200 text-red-800",
  neutral: "border-zinc-200 text-zinc-700",
  info: "border-cyan-200 text-cyan-800",
};

export const Toast = ({
  active,
  children,
  closeLabel = "閉じる",
  durationSeconds,
  onClose,
  tone = "neutral",
}: ToastProps) => {
  const [content, setContent] = useState<ToastContent | null>(null);
  const [open, setOpen] = useState(false);
  const latestContent = useRef<ToastContent>({ children, tone });

  latestContent.current = { children, tone };

  useEffect(() => {
    if (!active) {
      return;
    }

    setContent(latestContent.current);
    setOpen(true);
  }, [active]);

  useEffect(() => {
    if (!open || !content || durationSeconds === undefined) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setOpen(false);
    }, durationSeconds * 1000);

    return () => clearTimeout(timeoutId);
  }, [content, durationSeconds, open]);

  if (!open || !content) {
    return null;
  }

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <div
      aria-live="polite"
      className={clsx(
        "fixed top-3 left-1/2 z-50 flex w-[min(360px,calc(100vw-24px))] -translate-x-1/2 items-center justify-between gap-3 rounded-md border bg-white px-3 py-2 text-left text-sm leading-tight font-medium shadow-lg",
        toneClassNames[content.tone],
      )}
      role="status"
    >
      <div className="min-w-0 flex-1">{content.children}</div>
      <Button
        aria-label={closeLabel}
        icon={X}
        className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        onClick={close}
        text={<span className="sr-only">{closeLabel}</span>}
      />
    </div>
  );
};
