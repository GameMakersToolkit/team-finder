import * as React from "react";
import { useParams } from "react-router-dom";
import { usePostById } from "../queries/posts";
import { Post } from "../model/post";
import { PostView } from "./PostView";
import { LoadingSpinner } from "../pages/Home/components/LoadingSpinner";

export const PostViewWrapper: React.FC = () => {
  const { postId } = useParams()
  const query = usePostById({postId: postId!})

  if (query.isLoading) {
    return (<div className="mx-8"><p className="text-xl m-4">Loading...</p><LoadingSpinner /></div>)
  }

  if (query.data === undefined) {
    return (<div className="mx-8"><p>Could not find Post</p></div>)
  }

  const post = query.data as Post

  return (
    <div className="mx-8">
      <PostView post={post} />
    </div>
  )
}
