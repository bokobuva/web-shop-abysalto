import { useEffect, type RefObject } from "react";

export function useFocusOutside(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isActive) return;
    const handleFocusIn = (e: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, [isActive, onClose]);
}
