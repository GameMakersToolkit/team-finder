import React, {useState} from "react";
import { useReportedPostsList } from "../../queries/admin";
import { PostPreview } from "../../components/PostPreview";
import { ViewOptions } from "../Home/components/ViewOptions";
import {useUserInfo} from "../../queries/userInfo";

export const Admin: React.FC = () => {
  const userInfo = useUserInfo();
  const reportedPosts = useReportedPostsList();
  const [showSkillText, setShowSkillText] = useState(true)

  if (userInfo.isLoading) return (<div className="container mx-auto max-w-screen-xxl p-1">Loading...</div>)
  if (userInfo.data && !userInfo.data.isAdmin) return (<div className="container mx-auto max-w-screen-xxl p-1">User not authorized</div>)

  return (
    <div className="container mx-auto max-w-screen-xxl p-1">
      <ViewOptions showSkillText={showSkillText} setShowSkillText={setShowSkillText} />

      {reportedPosts.data && (
        <div className="mt-4">
          Reported posts: {reportedPosts.data.length} results found
        </div>
      )}
      {reportedPosts.data?.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          className="mt-4"
          adminView={true}
          adminId={userInfo.data!.id as string}
          showSkillText={showSkillText} />
      ))}
    </div>
  );
};
