import React, { useState } from "react";
import { Button } from "../../common/components/Button.tsx";
import { Field, Form, FormikProps } from "formik";
import { skills } from "../../common/models/skills.tsx";
import CustomSelect, { CustomSelectOption } from "../jamhome/components/common/CustomSelect.tsx";
import { languages } from "../../common/models/languages.ts";
import { tools } from "../../common/models/engines.tsx";
import { timezones } from "../../common/models/timezones.ts";
import { Post } from "../../common/models/post.ts";
import { ReactSelectFormik } from "./components/ReactSelectFormik.tsx";
import { availability } from "../../common/models/availability.ts";
import { iiicon } from "../../common/utils/iiicon.tsx";

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
    const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false);

    return (
        <>
        <Form className="text-[var(--theme-text)]">
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

            <button
              id="advanced-options-button"
              onClick={() => setShowAdvancedSearchOptions(!showAdvancedSearchOptions)}
              type="button"
            >
              {showAdvancedSearchOptions
                ? <>Show more options {iiicon('up-arrow', 'var(--theme-accent-dark)', 16, 16)}</>
                : <>Hide more options {iiicon('down-arrow', 'var(--theme-accent-dark)', 16, 16)}</>}
            </button>
            {showAdvancedSearchOptions && <AdvancedOptions values={values} />}

            {/* Quick workaround to stop Create Post button falling off bottom of form, until we replace float-right */}
            <div className="clear-both h-[0px]">&nbsp;</div>
        </Form>
        <Button
          className="mt-4 bg-[var(--theme-primary)] text-[var(--theme-text)] rounded-xl w-full sm:w-full md:w-auto"
          type="button"
          variant="primary"
          disabled={isSubmitting}
          onClick={submitForm}
        >
            {isSubmitting ? "Please wait..." : `${hasPost ? "Update" : "Create"} Post`}
        </Button>
        </>
    )
}

const AdvancedOptions: React.FC<{values: Post}> = ({values}) => {
  return (
    <>
        <div className="c-form-block bg-transparent">
            <FieldLanguages />
            <FieldTools />
        </div>

        <div className="c-form-block bg-transparent">
           <FieldTimezones />
           <FieldTeamSize current={values.size} />
        </div>

        <FieldAvailability currentAvailability={values.availability} />
    </>
  );
}

const FieldPortfolioLinks: React.FC<{portfolioLinks: string[]}> = () => {
    return (
      <div id="portfolio-links-field">
            <label htmlFor="portfolioLinks" className="text-lg flex gap-1">
                (Optional) Portfolio account links
            </label>
            <Field
                name="portfolioLinks"
                component={ReactSelectFormik}
            />
            <small className="block mb-2">Each entry must be a valid URL.</small>
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

    return (
        <div className="c-form-block bg-transparent w-full grid-cols-1">
            <div id="availability-radio-group">Availability</div>
            <div role="group" aria-labelledby="availability-radio-group">
                {availability.map(option => (
                    <label
                        key={option.value}
                        className={`text-xs form-block__availability ${option.value == currentAvailability ? "bg-[var(--theme-accent-dark)]" : "bg-[var(--theme-primary)] hover:bg-[var(--theme-accent-light)]"}`}
                    >
                        <Field type="radio" name="availability" value={option.value} />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    )
}
