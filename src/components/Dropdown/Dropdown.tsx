"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DROPDOWN_HOVER_DELAY_MS } from "@/app/shared/constants";

type DropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: "bottom-start" | "bottom-end" | "bottom";
  ariaLabel?: string;
};

const placementClasses = {
  "bottom-start": "left-0 top-full mt-1",
  "bottom-end": "right-0 top-full mt-1",
  bottom: "left-1/2 -translate-x-1/2 top-full mt-1",
};

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  placement = "bottom-end",
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

  useEffect(() => {
    if (!isOpen) return;
    const handleFocusIn = (e: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeImmediate();
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, [isOpen, closeImmediate]);

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
          className={`absolute z-50 min-w-[280px] max-w-[min(400px,calc(100vw-32px))] max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${placementClasses[placement]}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
