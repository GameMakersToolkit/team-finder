import {Button} from ".";
import {Meta, StoryObj} from "@storybook/react";

const meta = {
    title: 'Button',
    component: Button,
} satisfies Meta<typeof Button>

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: "default",
        children: "Hello World",
    }
}

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Hello World",
    }
}