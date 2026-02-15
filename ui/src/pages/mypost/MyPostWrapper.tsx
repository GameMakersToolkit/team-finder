import React from "react";
import {Formik, FormikProps} from "formik";
import {Post} from "../../common/models/post.ts";
import {MyPost} from "./MyPost.tsx";
import {toast} from "react-hot-toast";
import {useDeleteMyPostMutation, useMyPostMutation, useMyPostQuery} from "../../api/myPost.ts";
import {Button} from "../../common/components/Button.tsx";
import {useEnsureLoggedIn} from "../../api/ensureLoggedIn.ts";
import {useUserInfo} from "../../api/userInfo.ts";
import {useParams} from "react-router-dom";
import {JamSpecificStyling} from "../../common/components/JamSpecificStyling.tsx";
import {getDefaultLanguage, getDefaultTimezoneOffset} from '../../utils.ts';

// @ts-ignore
const defaultFormValues: Post = {
    jamId: "",
    description: "",
    itchAccountIds: undefined,
    size: 1,
    skillsPossessed: [],
    skillsSought: [],
    languages: [getDefaultLanguage()],
    preferredTools: [],
    availability: "UNSURE",
    timezoneOffsets: [getDefaultTimezoneOffset()],
}

export const MyPostWrapper: React.FC = () => {
  return (
    <JamSpecificStyling>
      <MyPostPage />
    </JamSpecificStyling>
  )
}

const MyPostPage: React.FC = () => {

    useEnsureLoggedIn();
    const userInfo = useUserInfo();
    const myPostQuery = useMyPostQuery();
    const post = myPostQuery?.data as Post;

    const { jamId } = useParams()
    defaultFormValues.jamId = jamId!!;

    const initialValues: Post = post ? {...post, timezoneOffsets: post?.timezoneOffsets.map(i => i.toString())} : defaultFormValues

    const onValidateForm = (values: Post) => {
        const errors = {}
        // @ts-ignore
        if (!values.description) errors.description = "A description is required"
        // @ts-ignore
        if (values.skillsSought.length == 0 && values.skillsPossessed.length == 0) errors.skills = "Please add some skills you have and/or are looking for"

        // itch.io username validation
        if (values.itchAccountIds) {
            // If any usernames include 'itch.io', the user did it wrong
            if (values.itchAccountIds.includes("itch.io")) {
                // @ts-ignore
                errors.itchAccountIds = "Don't include the itch.io page of the account username!"
            }

            const pattern = /[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/;
            for (const rawSubdomain of values.itchAccountIds.split(",")) {
                const subdomain = rawSubdomain.trim()
                if (!pattern.test(subdomain)) {
                    // @ts-ignore
                    errors.itchAccountIds = `${subdomain} isn't a valid itch.io username`
                }
            }
        }

        // Toast all errors in validation
        if (Object.keys(errors).length > 0) {
            Object.entries(errors).map(error => toast.error(error[1] as string))
        }

        return errors
    }

    const onSubmitForm = (values: any, setSubmitting: (a: boolean) => void) => {
        toast.dismiss()

        if (values.itchAccountIds === undefined) {
            values.itchAccountIds = ""
        }
        save(values)
        setTimeout(() => {
            setSubmitting(false)
        }, 800)
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
    if (userInfo?.isLoading || !userInfo.data) {return (<main><div className="c-form bg-transparent"><h1 className="text-3xl my-4">Please wait...</h1></div></main>)}

    /** Ensure we have active form data before rendering form  */
    if (myPostQuery?.isLoading) {return (<></>)}

    return (
        <main>
            <div className="c-form bg-transparent">
                <Formik
                    initialValues={ initialValues }
                    validate={ onValidateForm }
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={ (values, { setSubmitting }) => onSubmitForm(values, setSubmitting) }
                >
                    {(params: FormikProps<Post>) => (
                        <>
                            <h1 className="text-3xl my-4">Create New Post</h1>
                            <MyPost params={params}
                                    jamId={jamId!!}
                                    author={userInfo.data!.username as string}
                                    authorId={userInfo.data!.userId as string}
                                    hasPost={Boolean(post)}
                            />
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
            className="mt-4 bg-white text-black rounded-xl w-full sm:w-full md:w-auto md:left"
            type="submit"
            variant="default"
            disabled={false}
            onClick={onClickHandler}
        >
            Delete Post
        </Button>
    )
}
