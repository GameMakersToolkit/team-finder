import * as React from 'react';
import {Field, Form} from 'formik';
import {FormikSearchFormParameters} from '../models/FormikSearchFormParameters.ts';
import CustomSelect from './common/CustomSelect.tsx';
import {languages} from '../../../common/models/languages.ts';
import {skills} from '../../../common/models/skills.tsx';
import {tools} from '../../../common/models/engines.tsx';
import {timezones} from '../../../common/models/timezones.ts';
import {useState} from 'react';
import {SortingOptions} from './SortingOptions.tsx';
import {iiicon} from '../../../common/utils/iiicon.tsx';
import {blankSearchParameters} from '../models/SearchParameters.ts';
import {useSearchParams} from 'react-router-dom';

export const SearchForm: React.FC<{
    params: FormikSearchFormParameters
}> = ({params}) => {
    const [searchParams, _] = useSearchParams();
    const {values, handleChange, handleBlur} = params;
    const [showAdvancedSearchOptions, setShowAdvancedSearchOptions] = useState(false);

    return (
        <Form>
            <div className="c-form">
                <h2 className="text-xl my-2 font-bold text-center">Find people to jam with:</h2>

                <label htmlFor="description">Keywords</label>
                <input
                    type="text"
                    className="form-block__field w-full text-black hover:text-black px-2"
                    style={{lineHeight: 2.4}}
                    name="description"
                    id="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description || ''}
                />

                <div className="c-form-block">
                    <div id="skills-possessed-field">
                        <label htmlFor="skillsPossessed">I'm looking for:</label>
                        <Field
                            name="skillsPossessed"
                            id="skillsPossessed"
                            className="c-dropdown form-block__field w-full"
                            options={skills}
                            component={CustomSelect}
                            placeholder={'Select option(s)'}
                            isMulti={true}
                        />
                    </div>

                    <div id="skills-sought-field">
                        <label htmlFor="skillsSought">I can do:</label>
                        <Field
                            name="skillsSought"
                            id="skillsSought"
                            className="c-dropdown form-block__field w-full"
                            options={skills}
                            component={CustomSelect}
                            placeholder={'Select option(s)'}
                            isMulti={true}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button
                        id="clear-search-button"
                        onClick={() => {
                            const isOnlyBookmarked = searchParams.get('bookmarked') === 'true';
                            params.resetForm({values: blankSearchParameters});
                            if (isOnlyBookmarked) {
                                searchParams.set('bookmarked', 'true');
                            }
                        }}
                        type="button"
                    >
                        Clear Search
                    </button>

                    <button
                        id="advanced-options-button"
                        onClick={() => setShowAdvancedSearchOptions(!showAdvancedSearchOptions)}
                        type="button"
                    >
                        {showAdvancedSearchOptions ? <>Fewer
                            options {iiicon('up-arrow', 'var(--theme-accent-dark)', 16, 16)}</> : <>More
                            options {iiicon('down-arrow', 'var(--theme-accent-dark)', 16, 16)}</>}
                    </button>
                </div>

                {showAdvancedSearchOptions && <AdvancedOptions/>}
            </div>

            <div className="md:flex justify-between items-center mt-4 mb-4">
                <h2 className="text-3xl my-4 mr-2 inline-block">Search results</h2>
                <SortingOptions/>
            </div>

        </Form>
    );
};

const AdvancedOptions = () => {
    return (<div className="c-form-block">
            <div id="engines-field">
                <label htmlFor="tools">Preferred Engine(s):</label>
                <Field
                    name="tools"
                    id="tools"
                    className="c-dropdown form-block__field"
                    options={tools}
                    component={CustomSelect}
                    placeholder={'Select option(s)'}
                    isMulti={true}
                />
            </div>
            <div id="languages-field">
                <label htmlFor="languages">Language(s):</label>
                <Field
                    name="languages"
                    id="languages"
                    className="c-dropdown form-block__field"
                    options={languages}
                    component={CustomSelect}
                    placeholder={'Select option(s)'}
                    isMulti={true}
                />
            </div>
            <div id="timezones-field">
                <label htmlFor="timezoneStart">Earliest Timezone:</label>
                <Field
                    name="timezoneStart"
                    id="timezoneStart"
                    className="c-dropdown form-block__field"
                    options={timezones}
                    component={CustomSelect}
                    placeholder={'Select option(s)'}
                    isMulti={false}
                />
            </div>
            <div id="timezones-field">
                <label htmlFor="timezoneEnd">Latest Timezone:</label>
                <Field
                    name="timezoneEnd"
                    id="timezoneEnd"
                    className="c-dropdown form-block__field"
                    options={timezones}
                    component={CustomSelect}
                    placeholder={'Select option(s)'}
                    isMulti={false}
                />
            </div>
        </div>
    );
};
