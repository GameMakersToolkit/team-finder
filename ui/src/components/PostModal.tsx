import Modal, {Styles} from 'react-modal';
import * as React from 'react';
import { Post } from '../model/post';
import { SkillList } from './SkillList';
import { useAuth } from '../utils/AuthContext';
import { login } from '../utils/login';
import { ToolList } from './ToolList';
import { LanguageList } from './LanguageList';
import { AvailabilityList } from './AvailabilityList';
import { timezoneOffsetFromInt } from '../model/timezone';
import { FavouritePostIndicator } from './FavouritePostIndicator';
import { useCreateBotDmMutation } from '../queries/bot';
import { useReportPostMutation } from "../queries/posts";
import { toast } from "react-hot-toast";
import { useUserInfo } from "../queries/userInfo";

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
  showSkillText,
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
      <div>
        <div className="flex justify-between min-w-0">
          <span className="inline-block" style={{width: "calc(100% - 100px)"}}>
            <h3 className="font-bold text-xl overflow-hidden text-ellipsis">
              {post.author}
            </h3>
            <p className="text-sm">
              {post.size > 1
                ? `and ${post.size - 1} others are looking for members`
                : `is looking for members`}
            </p>
          </span>
          <FavouritePostIndicator
            post={post}
            className={`cursor-pointer`}
          />
          <span
            className="text-2xl my-auto font-bold cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            X
          </span>
        </div>
        <SkillList
          label="Looking for:"
          skills={post.skillsSought}
          className="[--skill-color:theme(colors.accent1)] mt-4"
          showText={showSkillText}
          labelOnNewLine={true}
        />
        <SkillList
          label="Brings:"
          skills={post.skillsPossessed}
          className="[--skill-color:theme(colors.accent2)] mt-4"
          showText={showSkillText}
          labelOnNewLine={true}
        />
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
          <ToolList
            tools={post.preferredTools}
            label={'Preferred Tools:'}
            className="mt-4"
            showText={true}
            labelOnNewLine={true}
          />
          <AvailabilityList
            availability={post.availability}
            label={'Availabilities'}
            className="mt-4"
            showText={true}
            labelOnNewLine={true}
          />
          <LanguageList
            languages={post.languages}
            label={'Language(s):'}
            className="mt-4"
            showText={true}
            labelOnNewLine={true}
          />
        </div>
        <p className="mt-4">
          Timezones:{' '}
          {post.timezoneOffsets.map((t) => timezoneOffsetFromInt(t)).join(', ')}
        </p>

        <div className="mb-16 mt-4 break-words" style={{wordBreak: "break-word"}}>
          {post.description.split("\n").map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
        </div>
      </div>

      <MessageOnDiscordButton
        authorName={post.author}
        authorId={post.authorId}
      />
      {/* report button */}
      <ReportButton post={post}/>
    </Modal>
  );
};

const ReportButton: React.FC<{ post: Post }> = ({
                                                    post
                                                }) => {
    const auth = useAuth();
    const reportPostMutation = useReportPostMutation();

    const onClick = (e: { preventDefault(): void }) => {
        e.preventDefault();

        reportPostMutation.mutate({
            id: post.id,
        }, {
            onSuccess: () => {
                toast("Thanks for reporting");
                let d = [post.id];
                const value = localStorage.getItem("reported");
                if (value != null && value != "") d = d.concat(JSON.parse(value))
                localStorage.setItem("reported", JSON.stringify(d));
            }
        });
    };

    const isReported: () => boolean = () => {
        const value = localStorage.getItem("reported");
        if (value == null || value == "") return false;
        const data: Array<string> = JSON.parse(value);
        return data.includes(post.id)
    }

    return (
        <>
            {auth &&
                <div className="flex justify-between min-w-0">
                {!isReported() &&
                    <a className="hover:underline decoration-stone-50" href="#report" onClick={onClick}>Report post</a>
                }
                {isReported() &&
                    <span>Thanks for reporting!</span>
                }
                </div>
            }
        </>
    )
}

/**
 * Present Discord CTA to user
 *
 * The direct link has been a bit finicky in the past - we should make this more robust where possible
 * TODO: Investigate if app links are feasible
 * TODO: Don't display if user fails Guild Permissions check
 */
const MessageOnDiscordButton: React.FC<CTAProps> = ({
  authorName,
  authorId,
}) => {
  const isLoggedIn = Boolean(useAuth());
  const userInfo = useUserInfo();
  const userCanPingAuthor = isLoggedIn && !userInfo.isLoading && userInfo.data?.isInDiscordServer

  const createBotDmMutation = useCreateBotDmMutation();

  return (
    <>
      {/* TODO: Position this relative to bottom of frame? */}
      <div className="text-center">
        {/* Span wraps anchor in case text splits onto two lines - we want one whole button shape */}
        <span
          className="mb-6 p-2 rounded inline-flex cursor-pointer"
          style={{ background: '#5865F2' }}
        >
          <a
            target="_blank"
            rel="noreferrer"
            href={
              isLoggedIn ? `https://discord.com/users/${authorId}` : undefined
            }
            onClick={!isLoggedIn ? login : undefined}
            className="text-sm"
          >
            Message {authorName} on Discord{' '}
            {!isLoggedIn && <>(Log in to continue)</>}
          </a>
        </span>

        <br />

        {userCanPingAuthor && (
          <span
            className="mb-6 p-2 rounded inline-flex cursor-pointer border"
            style={{ borderColor: '#5865F2' }}
          >
            <a
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                createBotDmMutation.mutate({ recipientId: authorId })
              }
              className="text-sm"
            >
              Direct Message button not working?
              <br />
              Click here to ping them in the channel
            </a>
          </span>
        )}
      </div>
    </>
  );
};
