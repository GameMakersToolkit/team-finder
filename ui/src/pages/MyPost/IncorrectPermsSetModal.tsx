import * as React from "react";
import Modal, {Styles} from "react-modal";

interface Props {
  isModalOpen: boolean;
}

const modalStyles: Styles = {
  content: {
    overflow: "scroll",
    position: "absolute",
    top: "10vh",
    height: "calc(80vh - 32px)",
  },
};

export const IncorrectPermsSetModal: React.FC<Props> = ({ isModalOpen }) => {

  const steps = import.meta.globEager("./incorrect-perms-steps/*.png");
  const stepImageStyles = "mt-4 sm-w-1/3 md:w-1/3 lg:w-1/3 inline-block"

  // Bind Modal to specific element for accessibility behaviour
  Modal.setAppElement(`#root`);

  return (
    <Modal
      isOpen={isModalOpen}
      style={modalStyles}
      className="bg-darkbg text-white inset-4 p-4 font-sans"
      contentLabel="Example Modal"
    >
      <h3 className="font-bold text-xl text-center">
        Users can&apos;t message you!
      </h3>
      <p>
        Your privacy settings mean other jam participants can&apos;t message you directly.
        You need to allow DMs from other members of the GMTK server before you can create a post.
      </p>

      <div className="flex items-start">
        <div className={stepImageStyles}>
          <p className="mb-2 text-sm font-italics text-center">1: Open the GMTK Discord server</p>
          <img
            src={steps[`./incorrect-perms-steps/step-1.png`].default}
            alt="Open the GMTK Discord server"
            style={{width: "90%", margin: "0 auto"}}
          />
        </div>
        <div className={stepImageStyles}>
          <p className="mb-2 text-sm font-italics text-center">2: Navigate to the server's Privacy Settings</p>
          <img
            src={steps[`./incorrect-perms-steps/step-2.png`].default}
            alt="Navigate to the server's Privacy Settings"
            style={{width: "90%", margin: "0 auto"}}
          />
        </div>
        <div className={stepImageStyles}>
          <p className="mb-2 text-sm font-italics text-center">3: Allow direct messages from server members</p>
          <img
            src={steps[`./incorrect-perms-steps/step-3.png`].default}
            alt="Allow direct messages from server members"
            style={{width: "90%", margin: "0 auto"}}
          />
        </div>
      </div>

    </Modal>
  )
}