import { X } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  children: ReactNode;
  closeDisabled?: boolean;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export const Modal = ({
  children,
  closeDisabled = false,
  isOpen,
  onClose,
  title,
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const requestClose = useCallback(() => {
    if (!closeDisabled) {
      onClose();
    }
  }, [closeDisabled, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, requestClose]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
      role="dialog"
    >
      <div
        className="max-h-[min(720px,calc(100vh-32px))] w-[min(560px,calc(100vw-32px))] overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-xl"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="m-0 text-base font-semibold text-zinc-900" id={titleId}>
            {title}
          </p>
          <button
            aria-label={`Close ${title}`}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-50"
            disabled={closeDisabled}
            onClick={requestClose}
            type="button"
          >
            <X aria-hidden="true" size={18} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
