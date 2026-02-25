import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HeroBanner } from "./HeroBanner";

const meta: Meta<typeof HeroBanner> = {
  title: "Components/HeroBanner",
  component: HeroBanner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
