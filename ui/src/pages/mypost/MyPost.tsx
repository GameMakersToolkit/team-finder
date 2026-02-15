import React from "react";
import { Button } from "../../common/components/Button.tsx";
import { Field, Form, FormikProps } from "formik";
import { skills } from "../../common/models/skills.tsx";
import CustomSelect, { CustomSelectOption } from "../jamhome/components/common/CustomSelect.tsx";
import { languages } from "../../common/models/languages.ts";
import { tools } from "../../common/models/engines.tsx";
import { timezones } from "../../common/models/timezones.ts";
import { Post } from "../../common/models/post.ts";
import { iiicon } from "../../common/utils/iiicon.tsx";
import { ReactSelectFormik } from "./components/ReactSelectFormik.tsx";

export const MyPost: React.FC<{
    params: FormikProps<Post>,
    jamId: string,
    author: string,
    authorId: string,
    hasPost: boolean
}> = ({
    params,
    jamId,
    author,
    authorId,
    hasPost
}) => {

    const {values, submitForm, isSubmitting} = params;

    return (
        <Form>
            <FieldDescription description={values.description} />

            <FieldPortfolioLinks portfolioLinks={values.portfolioLinks} />

            {/* This is jank, improve this later with a look up on submit */}
            <Field name="jamId" value={jamId} type="hidden" />
            <Field name="author" value={author} type="hidden" />
            <Field name="authorId" value={authorId} type="hidden" />

            <div className="c-form-block bg-transparent">
                <FieldSkillsPossessed />
                <FieldSkillsSought />
            </div>

            <div className="c-form-block bg-transparent">
                <FieldLanguages />
                <FieldTools />
            </div>

            <div className="c-form-block bg-transparent">
                <FieldTimezones />
                <FieldTeamSize current={values.size} />
            </div>

            {/*<FieldAvailability currentAvailability={values.availability} />*/}

            <Button
                className="mt-4 bg-[var(--theme-primary)] rounded-xl w-full sm:w-full md:w-auto md:float-right"
                type="button"
                variant="primary"
                disabled={isSubmitting}
                style={{color: "white"}}
                onClick={submitForm}
            >
                {isSubmitting ? "Please wait..." : `${hasPost ? "Update" : "Create"} Post`}
            </Button>
            {/* Quick workaround to stop Create Post button falling off bottom of form, until we replace float-right */}
            <div className="clear-both h-[0px]">&nbsp;</div>
        </Form>
    )
}

const FieldPortfolioLinks: React.FC<{portfolioLinks: string[]}> = ({portfolioLinks}) => {
    return (
      <div id="portfolio-links-field">
            <label htmlFor="portfolioLinks" className="text-lg flex gap-1">
                {iiicon('itchio', '#FFFFFF')} itch.io account links for your team. Enter one or more URLs.
            </label>
            <Field
                name="portfolioLinks"
                component={ReactSelectFormik}
            />
            <small className="block mb-2">Add links to itch.io profiles or games. Each entry must be a valid URL.</small>
        </div>
    );
};

const FieldDescription: React.FC<{ description: string}> = ({description}) => {
    return (
        <>
            <label htmlFor="description" className="text-lg">
                Write a brief summary of what you&apos;re looking for:
            </label>
            <small className="block mb-2">{2000 - description.length} characters remaining</small>
            <Field
                name="description"
                className="form-block__field block w-full text-black hover:text-black py-1 px-2"
                component="textarea"
                style={{height: 150}}
            />
        </>
    )
}

const FieldSkillsPossessed: React.FC = () => {
    return (
        <div id="skills-possessed-field">
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
        <div id="skills-sought-field">
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
      <div id="languages-field">
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
      <div id="engines-field">
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
      <div id="timezones-field">
            <label htmlFor="timezoneOffsets">What timezone(s) are you working in?</label>
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

const FieldTeamSize: React.FC<{current: number}> = ({current}) => {

    const teamSizes: CustomSelectOption[] = []
    for (let i = 1; i <= 40; i++) {
        teamSizes.push({label: i, value: i});
    }

    return (
        <div>
            <label htmlFor="size">How many people are in your team/group?</label>
            <Field
                name="size"
                className="c-dropdown form-block__field"
                options={teamSizes}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={false}
            />

            <span className="text-xs">
                (Including you!)
            </span>

            {current >= 15 && <span className="block text-xs">Wow... I hope you know what you're doing!</span>}
        </div>
    )
}

const FieldAvailability: React.FC<{ currentAvailability: string}> = ({currentAvailability}) => {

    const availabilityOptions: CustomSelectOption[] = [
        {label: "Not sure/haven't decided", value: "UNSURE"},
        {label: "A few hours over the whole jam", value: "MINIMAL"},
        {label: "Less than 4 hours per day", value: "PART_TIME"},
        {label: "4-8 hours per day", value: "FULL_TIME"},
        {label: "As much time as I can", value: "OVERTIME"}
    ];

    return (
        <div className="c-form-block bg-transparent w-full grid-cols-1">
            <div id="availability-radio-group">Availability</div>
            <div role="group" aria-labelledby="availability-radio-group">
                {availabilityOptions.map(option => (
                    <label
                        key={option.value}
                        className={`form-block__availability ${option.value == currentAvailability ? "bg-[var(--theme-primary)]" : "bg-[var(--theme-primary)] hover:bg-[var(--theme-accent-light)]"}`}
                    >
                        <Field type="radio" name="availability" value={option.value} />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    )
}
