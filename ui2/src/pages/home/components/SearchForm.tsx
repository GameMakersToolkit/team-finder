import * as React from "react";
import {Field, Form} from "formik";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import CustomSelect from "./common/CustomSelect.tsx"
import {languages} from "../../../common/models/languages.ts";
import {skills} from "../../../common/models/skills.tsx";
import {tools} from "../../../common/models/engines.tsx";
import {timezones} from "../../../common/models/timezones.ts";

export const SearchForm: React.FC<{
    params: FormikSearchFormParameters
}> = ({params}) => {
    const {values, handleChange, handleBlur} = params

    return (
        <Form>
            <input
                type="text"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
            />

            <div className="c-form-block">
                <label htmlFor="skillsPossessed">I'm looking for:</label>
                <Field
                    name="skillsPossessed"
                    className="form-block__field"
                    options={skills}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />

                <label htmlFor="skillsSought">I can do:</label>
                <Field
                    name="skillsSought"
                    className="form-block__field"
                    options={skills}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>

            <label htmlFor="tools">Preferred Engine(s):</label>
            <Field
                name="tools"
                options={tools}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />

            <label htmlFor="languages">Language(s):</label>
            <Field
                name="languages"
                options={languages}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />

            <Field
                name="earliestTimezone"
                options={timezones}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />

            <Field
                name="latestTimezone"
                options={timezones}
                component={CustomSelect}
                placeholder={"Select option(s)"}
                isMulti={true}
            />

            <button type="submit">
                Submit
            </button>
        </Form>
    )
}