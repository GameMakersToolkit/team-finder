import {Meta, StoryObj} from "@storybook/react";

import {PostView} from "./PostView";
import React from "react";
import {Context} from "../Context";

const meta = {
    title: 'Post view',
    component: PostView,
} satisfies Meta<typeof PostView>

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        post: {
            id: 'id',
            author: 'Author name',
            authorId: 'author-id',
            description: 'This is a free form description',
            size: 3,
            skillsPossessed: ["ART_2D", "CODE", "OTHER"],
            skillsSought: ["SOUND_MUSIC", "DESIGN_PRODUCTION"],
            preferredTools: ["UNITY", "GODOT"],
            availability: "MINIMAL",
            timezoneOffsets: [-5, 0, 1, 2, 3],
            languages: ["en"],
            isFavourite: false,
            reportCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: new Date()
        }
    }
}

Default.decorators = [
    (Story) => (
        <Context>
            <Story/>
        </Context>
    )
]