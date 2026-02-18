import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { Modal } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: fn(),
    children: <p>This content is not visible when closed.</p>,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: fn(),
    children: (
      <>
        <h2 id="modal-title" className="mb-4 text-xl font-semibold">
          Modal Title
        </h2>
        <p id="modal-desc">
          This is the modal content. You can close it with the button, by
          clicking outside, or by pressing Esc.
        </p>
      </>
    ),
    ariaLabelledBy: "modal-title",
    ariaDescribedBy: "modal-desc",
  },
};
