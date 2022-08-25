import * as React from "react";
import { useParams } from "react-router-dom";
import { usePostById } from "../queries/posts";
import { Post } from "../model/post";
import { PostView } from "./PostView";

export const PostViewWrapper: React.FC = () => {
  const { postId } = useParams()
  const query = usePostById({postId: postId!})

  if (query.isLoading) {
    return (<p>Loading...</p>)
  }

  if (query.data === undefined) {
    return (<p>Could not find.</p>)
  }

  const post = query.data as Post

  return (
    <div className="mx-8">
      <PostView post={post} onClick={() => window.location.replace("/")} />
    </div>
  )
}
