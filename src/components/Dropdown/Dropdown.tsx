"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DROPDOWN_HOVER_DELAY_MS } from "@/app/shared/constants";
import { useFocusOutside } from "@/hooks/useFocusOutside";

type DropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "bottom-start" | "bottom-end" | "bottom";
  ariaLabel?: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    clearTimeout();
    setIsOpen(true);
  }, [clearTimeout]);

  const close = useCallback(() => {
    clearTimeout();
    timeoutRef.current = window.setTimeout(
      () => setIsOpen(false),
      DROPDOWN_HOVER_DELAY_MS,
    );
  }, [clearTimeout]);

  const closeImmediate = useCallback(() => {
    clearTimeout();
    setIsOpen(false);
  }, [clearTimeout]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeImmediate();
    },
    [closeImmediate],
  );

  useEffect(() => {
    return clearTimeout;
  }, [clearTimeout]);

  useFocusOutside(containerRef, isOpen, closeImmediate);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={open}
      onMouseLeave={close}
      onFocus={open}
      onKeyDown={handleKeyDown}
      role="presentation"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          role="menu"
          className={`absolute z-50 min-w-[280px] max-w-[min(400px,calc(100vw-32px))] max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 right-0 top-full mt-1`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
