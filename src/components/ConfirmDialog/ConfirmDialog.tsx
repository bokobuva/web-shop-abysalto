"use client";

import { useCallback, useRef } from "react";

import { useBackdropClick } from "@/hooks/useBackdropClick";
import { useModalDialog } from "@/hooks/useModalDialog";

import { Button } from "@/components/Button";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  title?: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  title,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleBackdropClick = useBackdropClick<HTMLDialogElement>(onClose);
  useModalDialog(isOpen, dialogRef);

  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onClose}
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-black/40 [&::backdrop]:bg-black/40"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-sm border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
      >
        {title && (
          <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h2>
        )}
        <p className="mb-6 text-neutral-700 dark:text-neutral-300">{message}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleConfirm}
            dataTestId="confirm-dialog-confirm"
            ariaLabel={confirmLabel}
          >
            {confirmLabel}
          </Button>
          <Button
            onClick={onClose}
            dataTestId="confirm-dialog-cancel"
            ariaLabel={cancelLabel}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
};
