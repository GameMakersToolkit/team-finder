import Modal, {Styles} from 'react-modal';
import * as React from 'react';
import { Post } from '../model/post';
import { PostView } from "./PostView";

interface Props {
  post: Post;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  showSkillText: boolean;
}
const modalStyles: Styles = {
  content: {
    overflow: 'scroll',
    position: 'absolute',
    height: 'calc(100vh - 32px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};

export const PostModal: React.FC<Props> = ({
  post,
  isModalOpen,
  setIsModalOpen,
}) => {
  // Bind Modal to specific element for accessibility behaviour
  Modal.setAppElement(`#root`);

  return (
    <Modal
      isOpen={isModalOpen}
      style={modalStyles}
      htmlOpenClassName="overflow-hidden"
      className="bg-darkbg text-white inset-4 p-4 font-sans"
      contentLabel="Example Modal"
    >
      <PostView post={post} onClick={() => setIsModalOpen(false)} />
    </Modal>
  );
};
