import * as React from "react";
import {Field, Form} from "formik";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import CustomSelect from "./common/CustomSelect.tsx"
import {languages} from "../../../common/models/languages.ts";

export const SearchForm: React.FC<{params: FormikSearchFormParameters}> = ({params}) => {
    const {values, errors, touched, handleChange, handleBlur, handleSubmit} = params

    return (
        <Form onSubmit={handleSubmit}>
            <input
                type="text"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
            />
            {errors.description && touched.description && errors.description}

            <Field
                name="lookingFor"
                options={languages}
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