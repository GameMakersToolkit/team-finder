import * as React from "react";
import {Form} from "formik";
import {FormikSearchFormParameters} from "../Models/FormikSearchFormParameters.ts";

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
        </Form>
    )
}