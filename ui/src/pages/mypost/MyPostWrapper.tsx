import React from "react";
import {Formik, FormikErrors, FormikHelpers, FormikProps} from "formik";
import {PostFormValues} from "../../common/models/post.ts";
import {MyPost} from "./MyPost.tsx";
import {toast} from "react-hot-toast";
import {useDeleteMyPostMutation, useMyPostMutation, useMyPostQuery} from "../../api/myPost.ts";
import {Button} from "../../common/components/Button.tsx";
import {useEnsureLoggedIn} from "../../api/ensureLoggedIn.ts";
import {useUserInfo} from "../../api/userInfo.ts";
import {useParams} from "react-router-dom";
import {JamSpecificStyling} from "../../common/components/JamSpecificStyling.tsx";
import {getDefaultLanguage, getDefaultTimezoneOffset} from '../../utils.ts';
import {
  PostFormValidationErrors,
  validatePortfolioLinks,
  validateRequiredDescription,
  validateSkillsSelection,
} from "../../common/utils/formValidation.ts";
import { LoadingSpinner } from "../../common/components/LoadingSpinner.tsx";
import { ErrorDisplay } from "../../common/components/ErrorDisplay.tsx";

const getDefaultFormValues = (jamId: string): PostFormValues => ({
    jamId,
    author: "",
    authorId: "",
    description: "",
    portfolioLinks: [],
    size: 1,
    skillsPossessed: [],
    skillsSought: [],
    languages: [getDefaultLanguage()],
    preferredTools: [],
    availability: "UNSURE",
    timezoneOffsets: [getDefaultTimezoneOffset().toString()],
})

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
    const post = myPostQuery.data;

    const { jamId } = useParams();
    if (!jamId) {
      return <ErrorDisplay message="Missing jamId in route." actionLabel="Go home" onAction={() => window.location.assign("/")} />;
    }

    const initialValues: PostFormValues = post
      ? {
          jamId,
          author: post.author,
          authorId: post.authorId,
          portfolioLinks: post.portfolioLinks,
          description: post.description,
          size: post.size,
          skillsPossessed: post.skillsPossessed,
          skillsSought: post.skillsSought,
          preferredTools: post.preferredTools,
          availability: post.availability,
          timezoneOffsets: post.timezoneOffsets.map((offset) => offset.toString()),
          languages: post.languages,
        }
      : {
          ...getDefaultFormValues(jamId),
          author: userInfo.data?.username ?? "",
          authorId: userInfo.data?.id ?? "",
        };

    const onValidateForm = (values: PostFormValues): FormikErrors<PostFormValues> => {
        const errors: PostFormValidationErrors = {};
        const descriptionError = validateRequiredDescription(values.description);
        const skillsError = validateSkillsSelection(values.skillsSought, values.skillsPossessed);

        if (descriptionError) {
          errors.description = descriptionError;
        }
        if (skillsError) {
          errors.skills = skillsError;
        }

        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((errorMessage) => {
              if (errorMessage) {
                toast.error(errorMessage);
              }
            });
        }

        return errors as FormikErrors<PostFormValues>
    }

    const onSubmitForm = (values: PostFormValues, setSubmitting: FormikHelpers<PostFormValues>["setSubmitting"]) => {
        toast.dismiss()

        const portfolioError = validatePortfolioLinks(values.portfolioLinks || []);
        if (portfolioError) {
          toast.error(portfolioError);
          setSubmitting(false);
          return;
        }

        save(values)
        setSubmitting(false)
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
    if (userInfo?.isLoading || !userInfo.data) {
      return (
        <main>
          <div className="c-form bg-transparent">
            <LoadingSpinner label="Please wait..." />
          </div>
        </main>
      );
    }

    /** Ensure we have active form data before rendering form  */
    if (myPostQuery?.isLoading) {
      return <LoadingSpinner label="Loading your post..." />;
    }

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
                    {(params: FormikProps<PostFormValues>) => (
                        <>
                            <h1 className="text-3xl my-4">Create New Post</h1>
                            <MyPost params={params}
                                    hasPost={Boolean(post)}
                            />
                        </>
                    )}
                </Formik>
                {post && <DeletePostButton onClickHandler={() => deletePostMutation.mutate({ postId: post.id })} />}
            </div>
        </main>
    )
}

const DeletePostButton: React.FC<{onClickHandler: () => void}> = ({onClickHandler}) => {
    return (
        <Button
            className="mt-4 bg-red-600 text-white rounded-xl w-full sm:w-full md:w-auto md:float-right"
            type="submit"
            variant="default"
            disabled={false}
            onClick={onClickHandler}
        >
            Delete Post
        </Button>
    )
}
