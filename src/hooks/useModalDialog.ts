import { useEffect, useRef, type RefObject } from "react";

type UseModalDialogOptions = {
  restoreFocus?: boolean;
};

export function useModalDialog(
  isOpen: boolean,
  dialogRef: RefObject<HTMLDialogElement | null>,
  options: UseModalDialogOptions = {},
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { restoreFocus = false } = options;

  useEffect(() => {
    if (!isOpen) return;
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    }
    const dialog = dialogRef.current;
    if (dialog) dialog.showModal();
    return () => {
      dialog?.close();
      if (restoreFocus) {
        const previouslyFocused = previousFocusRef.current;
        queueMicrotask(() => previouslyFocused?.focus());
      }
    };
  }, [isOpen]);
}
