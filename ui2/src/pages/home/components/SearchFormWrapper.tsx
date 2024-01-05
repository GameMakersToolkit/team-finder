import * as React from "react";
import {Formik} from 'formik';
import {SearchParameters, searchParametersFromQueryString} from "../models/SearchParameters.ts";
import {SearchForm} from "./SearchForm.tsx";
import {useSearchParams} from "react-router-dom";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import {removeEmpty} from "../../../utils.ts"

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
        const formattedValues = removeEmpty({
            description: values['description'] || null,
            skillsPossessed: values['skillsPossessed']?.join(","),
            skillsSought: values['skillsSought']?.join(","),
            languages: values['languages']?.join(","),
            tools: values['tools']?.join(","),
        })
        setSearchParams(formattedValues)
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