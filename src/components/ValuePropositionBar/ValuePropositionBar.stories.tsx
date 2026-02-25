import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ValuePropositionBar } from "./ValuePropositionBar";

const meta: Meta<typeof ValuePropositionBar> = {
  title: "Components/ValuePropositionBar",
  component: ValuePropositionBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
