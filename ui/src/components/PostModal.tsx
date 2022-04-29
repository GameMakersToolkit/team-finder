import Modal, {Styles} from "react-modal";
import * as React from "react";
import { Post } from "../model/post";
import { SkillList } from "./SkillList";

interface Props {
    post: Post;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
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
            className="bg-darkbg text-white m-4 p-4 font-sans"
            contentLabel="Example Modal"
        >
            <h3 className="font-bold text-xl">{post.title}</h3>
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
            <p>{post.description}</p>
        </Modal>
    )
}