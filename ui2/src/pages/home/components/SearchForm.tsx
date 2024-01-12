import * as React from "react";
import {Field, Form} from "formik";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import CustomSelect from "./common/CustomSelect.tsx"
import {languages} from "../../../common/models/languages.ts";
import {skills} from "../../../common/models/skills.tsx";
import {tools} from "../../../common/models/engines.tsx";
import {timezones} from "../../../common/models/timezones.ts";
import {useState} from "react";
import {SortingOptions} from "./SortingOptions.tsx";

export const SearchForm: React.FC<{
    params: FormikSearchFormParameters
}> = ({params}) => {
    const {values, handleChange, handleBlur} = params;
    const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false);

    return (
        <Form>
            <div className="c-form">
                <h2 className="text-xl my-2 font-bold text-center">Find people to jam with:</h2>

                    <label htmlFor="description">Keywords</label>
                    <input
                        type="text"
                        className="form-block__field w-full"
                        style={{lineHeight: 2.4}}
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
                                className="c-dropdown form-block__field w-full"
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
                                className="c-dropdown form-block__field w-full"
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
            </div>

            <div className="md:flex justify-between items-center mt-4 mb-4">
                <h2 className="text-3xl my-4 mr-2 inline-block">Search results</h2>
                <SortingOptions />
            </div>

        </Form>
    )
}

const AdvancedOptions = () => {
    return (
        <div className="c-form-block">
            <div>
                <label htmlFor="tools">Preferred Engine(s):</label>
                <Field
                    name="tools"
                    className="c-dropdown form-block__field"
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
                    className="c-dropdown form-block__field"
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
                    className="c-dropdown form-block__field"
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
                    className="c-dropdown form-block__field"
                    options={timezones}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={true}
                />
            </div>
        </div>
    )
}