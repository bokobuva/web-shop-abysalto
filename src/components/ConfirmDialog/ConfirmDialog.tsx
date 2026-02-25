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
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-black/50 [&::backdrop]:bg-black/50"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        {title && (
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-zinc-50">
            {title}
          </h2>
        )}
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
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
