import React from "react";
import {Formik, FormikProps} from "formik";
import {Post} from "../../common/models/post.ts";
import {MyPost} from "./MyPost.tsx";
import {toast} from "react-hot-toast";
import {useDeleteMyPostMutation, useMyPostMutation, useMyPostQuery} from "../../api/myPost.ts";
import {Button} from "../../common/components/Button.tsx";
import {useEnsureLoggedIn} from "../../api/ensureLoggedIn.ts";

export const MyPostWrapper: React.FC = () => {

    useEnsureLoggedIn();
    const myPostQuery = useMyPostQuery();
    const post = myPostQuery?.data as Post;

    const initialValues: Post = {
        description: "",
        languages: ["en"]
    }

    const onSubmitForm = (values: any) => {
        save(values)
        console.log(values)
    }

    const onSubmitSuccess = () => {
        const createdOrUpdatedStr = post ? "updated" : "created";
        toast.success(`Post ${createdOrUpdatedStr} successfully!`);
    }

    const onDeleteSuccess = () => {
        toast.success(`Post deleted successfully!`);
        setTimeout(() => window.location.reload(), 200);
    }

    const { mutate: save, isLoading: isSaving } = useMyPostMutation({onSuccess: onSubmitSuccess});
    const deletePostMutation = useDeleteMyPostMutation({onSuccess: onDeleteSuccess});

    return (
        <main>
            <div className="c-form bg-black">
                <Formik
                    initialValues={ initialValues }
                    onSubmit={ onSubmitForm }
                >
                    {(params: FormikProps<Post>) => (
                        <>
                            <h1 className="text-3xl my-4">Create New Post</h1>
                            <MyPost params={params} />
                        </>
                    )}
                </Formik>
                {post && <DeletePostButton postId={post.id} onClick={deletePostMutation} />}
            </div>
        </main>
    )
}

const DeletePostButton: React.FC<{postId: string, onClick: any}> = ({postId, onClick}) => {
    return (
        <Button
            className="mt-4 bg-red-700 rounded-xl w-full sm:w-full md:w-auto md:left"
            type="submit"
            variant="default"
            disabled={false}
            style={{color: "white"}}
            onClick={onClick.mutate({ id: postId })}
        >
            Delete Post
        </Button>
    )
}
