"use client";

import { useEffect, useRef } from "react";

import { useBackdropClick } from "@/hooks/useBackdropClick";

import { Button } from "@/components/Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const handleBackdropClick = useBackdropClick<HTMLDialogElement>(onClose);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog) dialog.showModal();
    return () => {
      dialog?.close();
      const previouslyFocused = previousFocusRef.current;
      queueMicrotask(() => previouslyFocused?.focus());
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-black/50 [&::backdrop]:bg-black/50"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        {children}
        <div className="mt-4 w-full flex justify-end">
          <Button
            onClick={onClose}
            dataTestId="modal-close"
            ariaLabel="Close modal"
          >
            Close
          </Button>
        </div>
      </div>
    </dialog>
  );
};
