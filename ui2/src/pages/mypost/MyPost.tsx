import React from "react";
import {Field, Form, Formik, FormikProps} from "formik";
import {Post} from "../../common/models/post.ts";
import {FormikSearchFormParameters} from "../home/models/FormikSearchFormParameters.ts";
import {useAuth} from "../../api/AuthContext.tsx";
import {useMyPostQuery} from "../../api/myPost.ts";
import {useEnsureLoggedIn} from "../../api/ensureLoggedIn.ts";
import {skills} from "../../common/models/skills.tsx";
import CustomSelect from "../home/components/common/CustomSelect.tsx";
import {languages} from "../../common/models/languages.ts";
import {tools} from "../../common/models/engines.tsx";
import {timezones} from "../../common/models/timezones.ts";

export const MyPost: React.FC = () => {

    // useEnsureLoggedIn();
    // const auth = useAuth();
    // const myPostQuery = useMyPostQuery();

    const initialValues: Post = {
        description: "",
        languages: ["en"]
    }

    const onSubmitForm = (values: any) => {

    }

    return (
        <main>
            <div className="c-form bg-black">
                <Formik
                    initialValues={ initialValues }
                    onSubmit={ onSubmitForm }
                >
                    {(props: FormikProps<Post>) => (
                        <>
                            <h1 className="text-3xl my-4">Create New Post</h1>
                            {/*<h1 className="text-3xl my-4">{myPostQuery?.data ? `Edit Your Post` : `Create New Post`}</h1>*/}
                            <Form>
                                <FieldDescription description={props.values.description} />

                                <div className="c-form-block bg-black">
                                    <FieldSkillsPossessed />
                                    <FieldSkillsSought />
                                </div>

                                <div className="c-form-block bg-black">
                                    <FieldLanguages />
                                    <FieldTools />
                                </div>

                                <div className="c-form-block bg-black">
                                    <FieldTimezones />
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        </main>
    )
}

const FieldDescription: React.FC<{description: string}> = ({description}) => {
    return (
        <>
            <label htmlFor="description" className="text-lg">
                Write a brief summary of what you&apos;re looking for that isn&apos;t
                covered by the rest of the form:
            </label>
            <small className="block mb-2">{2000 - description.length} characters remaining</small>
            <Field
                name="description"
                className="form-block__field block w-full text-black hover:text-black"
                component="textarea"
                style={{height: 150}}
            />
        </>
    )
}

const FieldSkillsPossessed: React.FC = () => {
    return (
        <div>
            <label htmlFor="skillsPossessed">What skills do you have?</label>
            <Field
                name="skillsPossessed"
                className="form-block__field"
                options={skills}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />
        </div>
    )
}

const FieldSkillsSought: React.FC = () => {
    return (
        <div>
            <label htmlFor="skillsSought">What skills are you looking for?</label>
            <Field
                name="skillsSought"
                className="form-block__field"
                options={skills}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />
        </div>
    )
}

const FieldLanguages: React.FC = () => {
    return (
        <div>
            <label htmlFor="languages">What languages do you speak?</label>
            <Field
                name="languages"
                className="form-block__field"
                options={languages}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />
        </div>
    )
}

const FieldTools: React.FC = () => {
    return (
        <div>
            <label htmlFor="tools">What tools do you want to work with?</label>
            <Field
                name="tools"
                className="form-block__field"
                options={tools}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />
        </div>
    )
}

const FieldTimezones: React.FC = () => {
    return (
        <div>
            <label htmlFor="timezones">What timezone are you based in?</label>
            <Field
                name="timezones"
                className="form-block__field"
                options={timezones}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />

            <span className="text-xs">
                Timezone is an optional way for other participants to find people who will be awake/online at roughly the same of day.
            </span>
        </div>
    )
}