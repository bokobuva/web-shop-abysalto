import { useCallback } from "react";

export function useBackdropClick<T extends HTMLElement>(onClose: () => void) {
  return useCallback(
    (e: React.MouseEvent<T>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );
}
