import React from "react";
import {useReportedPostsList} from "../../queries/admin";
import {PostPreview} from "../../components/PostPreview";
import {Post} from "../../model/post";
import {apiRequest} from "../../utils/apiRequest";
import {useAuth} from "../../utils/AuthContext";

export const Admin : React.FC = () => {
    const auth = useAuth()
    const reportedPosts = useReportedPostsList()

    const deletePostAction = (post: Post) => {
        apiRequest<Post[]>(`/admin/post`, {
            logout: () => console.log("Intentionally empty method")
        }, {
            authToken: auth?.token,
            method: "DELETE",
            body: {postId: post.id},
        }).then(_ => window.location.reload());
    }

    return (
        <div className="container mx-auto max-w-screen-xxl p-1">
            {reportedPosts.data && (
                <div className="mt-4">Reported posts: {reportedPosts.data.length} results found</div>
            )}
            {reportedPosts.data?.map((post) => (
                <PostPreview
                    key={post.id}
                    post={post}
                    className="mt-4"
                    adminView={true}
                    deletePost={() => deletePostAction(post)} />
            ))}
        </div>
    )
}