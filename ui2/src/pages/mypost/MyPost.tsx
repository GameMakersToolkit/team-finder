import React from "react";
import {Button} from "../../common/components/Button.tsx";
import {Field, Form, FormikProps} from "formik";
import {skills} from "../../common/models/skills.tsx";
import CustomSelect from "../home/components/common/CustomSelect.tsx";
import {languages} from "../../common/models/languages.ts";
import {tools} from "../../common/models/engines.tsx";
import {timezones} from "../../common/models/timezones.ts";
import {Post} from "../../common/models/post.ts";

export const MyPost: React.FC<{
    params: FormikProps<Post>,
    author: string,
    authorId: string,
    hasPost: boolean
}> = ({
    params,
    author,
    authorId,
    hasPost
}) => {

    const {values, submitForm} = params;

    return (
        <Form>
            <FieldDescription description={values.description} />

            {/* This is jank, improve this later with a look up on submit */}
            <Field name="author" value={author} type="hidden" />
            <Field name="authorId" value={authorId} type="hidden" />

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

            <Button
                className="mt-4 bg-blue-700 rounded-xl w-full sm:w-full md:w-auto md:float-right"
                type="button"
                variant="primary"
                disabled={false}
                style={{color: "white"}}
                onClick={submitForm}
            >
                {`${hasPost ? "Update" : "Create"} Post`}
            </Button>
        </Form>
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
                className="c-dropdown form-block__field"
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
                className="c-dropdown form-block__field"
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
                className="c-dropdown form-block__field"
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
            <label htmlFor="preferredTools">What tools do you want to work with?</label>
            <Field
                name="preferredTools"
                className="c-dropdown form-block__field"
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
            <label htmlFor="timezoneOffsets">What timezone are you based in?</label>
            <Field
                name="timezoneOffsets"
                className="c-dropdown form-block__field"
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