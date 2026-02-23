import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { useState } from "react";

import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={fn()}
        message="Are you sure you want to remove this item? Note that all quantities will be removed from the cart."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveWrapper />,
};

export const WithTitle: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn(),
    message: "This action cannot be undone.",
    title: "Confirm deletion",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
};
