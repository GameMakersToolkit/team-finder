import * as React from "react";
import { useParams } from "react-router-dom";
import { useReportPostMutation, useReportBrokenDMsPostMutation } from "../queries/posts";
import { FavouritePostIndicator } from "./FavouritePostIndicator";
import { SkillList } from "./SkillList";
import { ToolList } from "./ToolList";
import { AvailabilityList } from "./AvailabilityList";
import { LanguageList } from "./LanguageList";
import { timezoneOffsetFromInt } from "../model/timezone";
import { Post } from "../model/post";
import { useAuth } from "../utils/AuthContext";
import { toast } from "react-hot-toast";
import { useUserInfo } from "../queries/userInfo";
import { useCreateBotDmMutation } from "../queries/bot";
import { login } from "../utils/login";

export const PostView: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <>
    <div className="py-4 text-xl">
        <span className="text-grey-200 mr-2">Search results</span>
        <span className="mr-2">&gt;</span>
        <span>{post.author}</span>
    </div>
    <div className="bg-grey-500 rounded-xl p-4">
        <div className="flex justify-between min-w-0">
          <span className="inline-block" style={{ width: "calc(100% - 100px)" }}>
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
        </div>
        <SkillList
          label="Looking for:"
          skills={post.skillsSought}
          className="[--skill-color:theme(colors.blue-800)] mt-4"
          showText={true}
          labelOnNewLine={true}
        />
        <SkillList
          label="Can do:"
          skills={post.skillsPossessed}
          className="[--skill-color:theme(colors.blue-900)] mt-4"
          showText={true}
          labelOnNewLine={true}
        />
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-4">
          <ToolList
            tools={post.preferredTools}
            label={'Preferred Tools:'}
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
          <AvailabilityList
            availability={post.availability}
            label={'Availabilities'}
            className="mt-4"
            showText={true}
            labelOnNewLine={true}
          />
          <dl className="text-lg mt-4">
              <dt className={`py-1 block w-full`}>
                Timezones
              </dt>
              <dd
                  key={'timezones'}
                  className={`py-1 text-sm`}
              >
                {post.timezoneOffsets.map((t) => timezoneOffsetFromInt(t)).join(', ')}
              </dd>
          </dl>
        </div>

        <div className="mb-16 mt-4 break-words" style={{ wordBreak: "break-word" }}>
          {post.description.split("\n").map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
        </div>

      <MessageOnDiscordButton
        authorName={post.author}
        authorId={post.authorId}
        unableToContactCount={post.unableToContactCount}
      />

      <div className="p-4 flex justify-between">
        <div className="mb-2">
          <a className="font-bold underline cursor-pointer" onClick={() => history.back()}>&lt; Back to search results</a>
        </div>

        <div className="mb-2">
            <ReportButton post={post} />
        </div>
      </div>

{/*       <ReportBrokenDMsButton post={post} /> */}

      </div>
    </>
  )
}


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
            <a className="font-bold underline cursor-pointer" href="#report" onClick={onClick}><span>&#9873;</span> Report post</a>
          }
          {isReported() &&
            <span>Thanks for reporting!</span>
          }
        </div>
      }
    </>
  )
}

const ReportBrokenDMsButton: React.FC<{ post: Post }> = ({
  post
}) => {
  const auth = useAuth();
  const reportMutation = useReportBrokenDMsPostMutation();

  const onClick = (e: { preventDefault(): void }) => {
    e.preventDefault();

    reportMutation.mutate({
      id: post.id,
    }, {
      onSuccess: () => {
        toast("Thanks for letting us know!");
        let d = [post.id];
        const value = localStorage.getItem("reported_dms");
        if (value != null && value != "") d = d.concat(JSON.parse(value))
        localStorage.setItem("reported_dms", JSON.stringify(d));
      }
    });
  };

  const isReported: () => boolean = () => {
    const value = localStorage.getItem("reported_dms");
    if (value == null || value == "") return false;
    const data: Array<string> = JSON.parse(value);
    return data.includes(post.id)
  }

  return (
    <>
      {auth &&
        <div className="flex justify-between min-w-0">
          {!isReported() &&
            <a className="hover:underline decoration-stone-50" href="#report" onClick={onClick}>Discord button not working?</a>
          }
          {isReported() &&
            <span>Thanks, we&apos;ll look into this.</span>
          }
        </div>
      }
    </>
  )
}


interface CTAProps {
  authorName: string;
  authorId: string;
  unableToContactCount: number
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
  unableToContactCount,
}) => {
  const isLoggedIn = Boolean(useAuth());
  const userInfo = useUserInfo();
  const canPostAuthorBeDMd = unableToContactCount < 5; // Arbitrary number

  const userShouldSeePingButton = isLoggedIn && !userInfo.isLoading;
  const userCanPingAuthor = userInfo.data?.isInDiscordServer;

  const createBotDmMutation = useCreateBotDmMutation();

  const fallbackPingMessage = canPostAuthorBeDMd ? "Message button not working?" : "This post's author cannot receive direct messages"

  return (
    <>
      {/* TODO: Position this relative to bottom of frame? */}
      <div className="text-center">
        {canPostAuthorBeDMd && <><PrimaryCta authorId={authorId} authorName={authorName} isLoggedIn={isLoggedIn} /><br /></>}

        {/* If the user isn't logged in, don't display anything at all; it just looks kinda bad */}
        {userShouldSeePingButton
          ? (
            <>{userCanPingAuthor
              ? <FallbackPingCta authorId={authorId} createBotDmMutation={createBotDmMutation} message={fallbackPingMessage} />
              : <p>Sorry, you can&apos;t contact this user right now.<br />Please make sure you&apos;ve joined the discord server!</p>
            }</>
          )
          : <></>
        }
      </div>
    </>
  );
};


const PrimaryCta: React.FC<{ authorId: string, authorName: string, isLoggedIn: boolean }> = ({
  authorId,
  authorName,
  isLoggedIn,
}) => {
  return (
    <span
      className="mb-6 px-6 py-2 bg-blue-200 border-blue-200 rounded-xl text-grey-900 font-bold inline-flex cursor-pointer"
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
    </span >
  );
};


const FallbackPingCta: React.FC<{ authorId: string, createBotDmMutation: any, message: string }> = ({
  authorId,
  createBotDmMutation,
  message,
}) => {
  return (
  <>
    <p className="mb-2">{message}</p>


    <span
      className="mb-6 p-2 rounded inline-flex cursor-pointer rounded-xl border border-blue-200 text-blue-200"
    >

      <a
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          createBotDmMutation.mutate({ recipientId: authorId })
        }
        className="text-sm"
      >
        Ping them on Discord
      </a>
    </span>
    </>
  );
};