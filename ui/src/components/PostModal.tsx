import Modal, {Styles} from "react-modal";
import * as React from "react";
import { Post } from "../model/post";
import { SkillList } from "./SkillList";
import {useAuth} from "../utils/AuthContext";

interface Props {
    post: Post;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
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

export const PostModal: React.FC<Props> = ({ post, isModalOpen, setIsModalOpen }) => {

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
                className="[--skill-color:theme(colors.accent1)]"
            />
            <SkillList
                label="Brings:"
                skills={post.skillsPossessed}
                className="[--skill-color:theme(colors.accent2)]"
            />
            <p className="mb-16">{post.description}</p>

            <ModalCallToAction authorName={post.author} authorId={post.authorId} />
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
const ModalCallToAction: React.FC<CTAProps> = ({ authorName, authorId }) => {
    const isLoggedIn = Boolean(useAuth());

    if (!isLoggedIn) return (<></>)

    return (
        <>
        {/* TODO: Position this relative to bottom of frame? */}
         <div className="text-center">
             {/* Span wraps anchor in case text splits onto two lines - we want one whole button shape */}
             <span className="p-2 rounded inline-flex" style={{background:"#5865F2"}}>
                <a
                    target="_blank" rel="noreferrer"
                    href={`https://discordapp.com/channels/@me/${authorId}`}
                    className="text-sm"
                >
                    Message {authorName} on Discord
                </a>
            </span>
         </div>
        </>
    )
}