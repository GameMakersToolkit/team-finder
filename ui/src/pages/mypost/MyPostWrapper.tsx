import React from "react";
import {Formik, FormikProps} from "formik";
import {Post} from "../../common/models/post.ts";
import {MyPost} from "./MyPost.tsx";
import {toast} from "react-hot-toast";
import {useDeleteMyPostMutation, useMyPostMutation, useMyPostQuery} from "../../api/myPost.ts";
import {Button} from "../../common/components/Button.tsx";
import {useEnsureLoggedIn} from "../../api/ensureLoggedIn.ts";
import {useUserInfo} from "../../api/userInfo.ts";

// @ts-ignore
const defaultFormValues: Post = {
    description: "",
    size: 1,
    skillsPossessed: [],
    skillsSought: [],
    languages: ["en"],
    preferredTools: [],
    availability: "MINIMAL", //allAvailabilities[0],
    timezoneOffsets: ["1"] // ["UTC+0"] as TimezoneOffset[],
}

export const MyPostWrapper: React.FC = () => {

    useEnsureLoggedIn();
    const userInfo = useUserInfo();
    const myPostQuery = useMyPostQuery();
    const post = myPostQuery?.data as Post;

    const initialValues: Post = post ? {...post, timezoneOffsets: post?.timezoneOffsets.map(i => i.toString())} : defaultFormValues

    const onValidateForm = (values: Post) => {
        const errors = []
        // @ts-ignore
        if (!values.description) errors.push("A description is required")

        return errors
    }

    const onSubmitForm = (values: any) => {
        const errors = onValidateForm(values)
        if (errors.length > 0) {
            errors.map(error => toast.error(error))
            return
        }

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

    const { mutate: save } = useMyPostMutation({onSuccess: onSubmitSuccess});
    const deletePostMutation = useDeleteMyPostMutation({onSuccess: onDeleteSuccess});

    /** Ensure user is logged in to view the page; give them enough information to see what's happening */
    if (userInfo?.isLoading || !userInfo.data) {return (<main><div className="c-form bg-black"><h1 className="text-3xl my-4">Please wait...</h1></div></main>)}

    /** Ensure we have active form data before rendering form  */
    if (myPostQuery?.isLoading) {return (<></>)}

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
                            <MyPost params={params}
                                    author={userInfo.data!.username as string}
                                    authorId={userInfo.data!.userId as string}
                                    hasPost={Boolean(post)} />
                        </>
                    )}
                </Formik>
                {post && <DeletePostButton postId={post.id} onClickHandler={() => deletePostMutation.mutate({ postId: post.id })} />}
            </div>
        </main>
    )
}

const DeletePostButton: React.FC<{postId: string, onClickHandler: any}> = ({onClickHandler}) => {
    return (
        <Button
            className="mt-4 bg-red-700 rounded-xl w-full sm:w-full md:w-auto md:left"
            type="submit"
            variant="default"
            disabled={false}
            style={{color: "white"}}
            onClick={onClickHandler}
        >
            Delete Post
        </Button>
    )
}
