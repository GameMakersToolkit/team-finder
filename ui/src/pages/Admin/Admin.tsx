import React from "react";
import { useReportedPostsList } from "../../queries/admin";
import { PostPreview } from "../../components/PostPreview";

export const Admin: React.FC = () => {
  const reportedPosts = useReportedPostsList();
  

  return (
    <div className="container mx-auto max-w-screen-xxl p-1">
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
        />
      ))}
    </div>
  );
};
