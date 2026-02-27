"use client";

import { useRef } from "react";

import { useBackdropClick } from "@/hooks/useBackdropClick";
import { useModalDialog } from "@/hooks/useModalDialog";

import { Button } from "@/components/Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  hideCloseButton?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
  ariaDescribedBy,
  hideCloseButton = false,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const handleBackdropClick = useBackdropClick<HTMLDialogElement>(onClose);
  useModalDialog(isOpen, dialogRef, { restoreFocus: true });

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-black/40 [&::backdrop]:bg-black/40"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="fixed left-1/2 top-1/2 max-h-[90vh] w-[90dvw] max-w-[90dvw] md:w-full md:max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-sm border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
      >
        {children}
        {!hideCloseButton && (
          <div className="mt-4 w-full flex justify-end">
            <Button
              onClick={onClose}
              dataTestId="modal-close"
              ariaLabel="Close modal"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </dialog>
  );
};
