import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Dropdown } from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <button type="button">Hover me</button>,
    children: (
      <div className="p-4">
        <p className="text-sm">Dropdown content appears here.</p>
      </div>
    ),
  },
};
