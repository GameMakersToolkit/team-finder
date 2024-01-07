import * as React from "react";
import {Field, Form} from "formik";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import CustomSelect from "./common/CustomSelect.tsx"
import {languages} from "../../../common/models/languages.ts";
import {skills} from "../../../common/models/skills.tsx";
import {tools} from "../../../common/models/engines.tsx";
import {timezones} from "../../../common/models/timezones.ts";
import {useState} from "react";

export const SearchForm: React.FC<{
    params: FormikSearchFormParameters
}> = ({params}) => {
    const {values, handleChange, handleBlur} = params;
    const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false);

    return (
        <>
            <h2 className="text-xl my-2 font-bold text-center">Find people to jam with:</h2>

            <Form>
                <label htmlFor="description">Keywords</label>
                <input
                    type="text"
                    className="form-block__field w-full"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                />

                <div className="c-form-block">
                    <div>
                        <label htmlFor="skillsPossessed">I'm looking for:</label>
                        <Field
                            name="skillsPossessed"
                            className="form-block__field"
                            options={skills}
                            component={CustomSelect}
                            placeholder={"Select option(s)"}
                            isMulti={true}
                        />
                    </div>

                    <div>
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
                </div>

                <div className="text-center">
                    <button id="clear-search-button" onClick={() => {params.resetForm()}}>
                        Clear Search
                    </button>

                    <button id="advanced-options-button" onClick={() => setShowAdvancedSearchOptions(!showAdvancedSearchOptions)}>
                        {showAdvancedSearchOptions ? <>Fewer options ^</> : <>More options V</>}
                    </button>
                </div>

                {showAdvancedSearchOptions && <AdvancedOptions />}

            </Form>
        </>
    )
}

const AdvancedOptions = () => {
    return (
        <div className="c-form-block">
            <div>
                <label htmlFor="tools">Preferred Engine(s):</label>
                <Field
                    name="tools"
                    className="form-block__field"
                    options={tools}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>
            <div>
                <label htmlFor="languages">Language(s):</label>
                <Field
                    name="languages"
                    className="form-block__field"
                    options={languages}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>
            <div>
                <label htmlFor="earliestTimezone">Earliest Timezone:</label>
                <Field
                    name="earliestTimezone"
                    className="form-block__field"
                    options={timezones}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>
            <div>
                <label htmlFor="latestTimezone">Latest Timezone:</label>
                <Field
                    name="latestTimezone"
                    className="form-block__field"
                    options={timezones}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>
        </div>
    )
}