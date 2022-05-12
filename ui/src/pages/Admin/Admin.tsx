import React, {useState} from "react";
import { useReportedPostsList } from "../../queries/admin";
import { PostPreview } from "../../components/PostPreview";
import { ViewOptions } from "../Home/components/ViewOptions";

export const Admin: React.FC = () => {
  const reportedPosts = useReportedPostsList();
  const [showSkillText, setShowSkillText] = useState(true)

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
          showSkillText={showSkillText} />
      ))}
    </div>
  );
};
