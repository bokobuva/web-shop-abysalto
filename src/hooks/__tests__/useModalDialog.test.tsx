import { act, renderHook } from "@testing-library/react";
import { useRef, useState } from "react";

import { useModalDialog } from "../useModalDialog";

describe("useModalDialog", () => {
  it("calls showModal when isOpen becomes true", () => {
    const { result } = renderHook(() => {
      const [isOpen, setIsOpen] = useState(false);
      const dialogRef = useRef<HTMLDialogElement>(null);
      useModalDialog(isOpen, dialogRef);
      return { isOpen, setIsOpen, dialogRef };
    });

    const dialog = document.createElement("dialog");
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();
    Object.defineProperty(result.current.dialogRef, "current", {
      value: dialog,
      writable: true,
    });

    act(() => {
      result.current.setIsOpen(true);
    });

    expect(dialog.showModal).toHaveBeenCalled();
  });

  it("calls close on cleanup when isOpen becomes false", () => {
    const dialog = document.createElement("dialog");
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    const { result } = renderHook(() => {
      const [isOpen, setIsOpen] = useState(true);
      const dialogRef = useRef<HTMLDialogElement | null>(dialog);
      useModalDialog(isOpen, dialogRef);
      return { isOpen, setIsOpen, dialogRef };
    });

    act(() => {
      result.current.setIsOpen(false);
    });

    expect(dialog.close).toHaveBeenCalled();
  });

  it("restores focus when restoreFocus is true", async () => {
    const trigger = document.createElement("button");
    trigger.focus = jest.fn();
    document.body.appendChild(trigger);
    Object.defineProperty(document, "activeElement", {
      value: trigger,
      configurable: true,
    });

    const dialog = document.createElement("dialog");
    dialog.showModal = jest.fn();
    dialog.close = jest.fn();

    const { unmount } = renderHook(() => {
      const dialogRef = useRef<HTMLDialogElement | null>(dialog);
      useModalDialog(true, dialogRef, { restoreFocus: true });
      return null;
    });

    await act(async () => {
      unmount();
    });

    // Focus restore happens in queueMicrotask - allow it to run
    await act(async () => {
      await new Promise((resolve) => queueMicrotask(resolve));
    });

    expect(trigger.focus).toHaveBeenCalled();
  });
});
