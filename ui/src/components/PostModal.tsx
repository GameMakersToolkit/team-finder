import Modal, {Styles} from "react-modal";
import * as React from "react";
import { Post } from "../model/post";
import { SkillList } from "./SkillList";
import { useAuth } from "../utils/AuthContext";
import { login } from "../utils/login";
import {ToolList} from "./ToolList";
import {LanguageList} from "./LanguageList";
import {AvailabilityList} from "./AvailabilityList";
import {timezoneOffsetFromInt} from "../model/timezone";

interface Props {
    post: Post;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    showSkillText: boolean;
}

interface CTAProps {
    authorName: string;
    authorId: string;
}

const modalStyles: Styles = {
    content: {
        overflow: "scroll",
        position: "absolute",
        height: "calc(100vh - 32px)",
    },
};

export const PostModal: React.FC<Props> = ({ post, isModalOpen, setIsModalOpen, showSkillText }) => {

    // Bind Modal to specific element for accessibility behaviour
    Modal.setAppElement(`#root`);

    return (
        <Modal
            isOpen={isModalOpen}
            style={modalStyles}
            className="bg-darkbg text-white inset-4 p-4 font-sans"
            contentLabel="Example Modal"
        >
            <h3 className="font-bold text-xl">
                {post.title}
                <span className="float-right font-bold cursor-pointer" onClick={() => setIsModalOpen(false)}>X</span>
            </h3>
            <SkillList
                label="Looking for:"
                skills={post.skillsSought}
                className="[--skill-color:theme(colors.accent1)] mt-4"
                showText={showSkillText}
            />
            <SkillList
                label="Brings:"
                skills={post.skillsPossessed}
                className="[--skill-color:theme(colors.accent2)] mt-4"
                showText={showSkillText}
            />
            <ToolList
              tools={post.preferredTools}
              label={"Preferred Tools:"}
              className="mt-4"
              showText={true}
            />
            <AvailabilityList
              availability={post.availability}
              label={"Availabilities"}
              className="mt-4"
              showText={true}
            />
            <LanguageList
              languages={post.languages}
              label={"Language(s):"}
              className="mt-4"
              showText={true}
            />
            <p className="mt-4">Timezone: {timezoneOffsetFromInt(post.timezoneOffset)}</p>
            <p className="mb-16 mt-4">{post.description}</p>

            <MessageOnDiscordButton authorName={post.author} authorId={post.authorId} />
        </Modal>
    )
}

/**
 * Present Discord CTA to user
 *
 * The direct link has been a bit finicky in the past - we should make this more robust where possible
 * TODO: Investigate if app links are feasible
 * TODO: Don't display if user fails Guild Permissions check
 */
const MessageOnDiscordButton: React.FC<CTAProps> = ({ authorName, authorId }) => {
    const isLoggedIn = Boolean(useAuth());

    return (
        <>
        {/* TODO: Position this relative to bottom of frame? */}
         <div className="text-center">
             {/* Span wraps anchor in case text splits onto two lines - we want one whole button shape */}
             <span className="p-2 rounded inline-flex cursor-pointer" style={{background:"#5865F2"}}>
                <a
                    target="_blank" rel="noreferrer"
                    href={isLoggedIn ? `https://discordapp.com/channels/@me/${authorId}` : undefined}
                    onClick={!isLoggedIn ? login : undefined}
                    className="text-sm"
                >
                    Message {authorName} on Discord {!isLoggedIn && <>(Log in to continue)</>}
                </a>
            </span>
         </div>
        </>
    )
}
