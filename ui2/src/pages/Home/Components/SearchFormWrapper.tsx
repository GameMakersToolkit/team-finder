import * as React from "react";
import {Formik} from 'formik';
import {SearchParameters, searchParametersFromQueryString} from "../Models/SearchParameters.ts";
import {SearchForm} from "./SearchForm.tsx";
import {useSearchParams} from "react-router-dom";
import {FormikSearchFormParameters} from "../Models/FormikSearchFormParameters.ts";

export const SearchFormWrapper: React.FC = () => {

    // @ts-ignore
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFormValues: SearchParameters = searchParametersFromQueryString(searchParams)

    // @ts-ignore
    const validateForm = (values) => {
        const errors = {};
        // Fill in here
        return errors;
    }

    // @ts-ignore
    const onSubmitForm = (values) => {
        setSearchParams(values)
    }

    return (
        <>
            <Formik
                initialValues={ initialFormValues }
                validate={ validateForm }
                onSubmit={ onSubmitForm }
            >
                {(params: FormikSearchFormParameters) => <SearchForm params={params} />}
            </Formik>
        </>
    )
}