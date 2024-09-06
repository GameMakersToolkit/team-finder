import * as React from "react";
import {Formik, useFormikContext} from 'formik';
import {SearchParameters, searchParametersFromQueryString} from "../models/SearchParameters.ts";
import {SearchForm} from "./SearchForm.tsx";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import {removeEmpty} from "../../../utils.ts"
import debounce from "just-debounce-it";

export const SearchFormWrapper: React.FC<{
    searchParams: URLSearchParams,
    setSearchParams: (value: any) => void
}> = ({searchParams, setSearchParams}) => {

    const initialFormValues: SearchParameters = searchParametersFromQueryString(searchParams)

    const onSubmitForm = (values: any) => {
        // Remove the empty fields, so we don't clutter up the query string with &a=&b=...
        const formattedValues: Partial<SearchParameters> = removeEmpty(values)

        // If we only have one timezone flag set, don't send either in query string
        if (!values['timezoneStart'] || !values['timezoneEnd']) {
            delete formattedValues.timezoneStart
            delete formattedValues.timezoneEnd
        }

        // TODO: Oh god why
        formattedValues.bookmarked = searchParams.get('bookmarked') ? true : null
        if (formattedValues.bookmarked == null) delete formattedValues.bookmarked

        // @ts-ignore
        setSearchParams(formattedValues)
    }

    return (
        <>
            <Formik
                initialValues={ initialFormValues }
                validate={ () => {} }
                onSubmit={ onSubmitForm }
            >
                {(params: FormikSearchFormParameters) => (
                    <>
                        <AutoSave debounceMs={50} />
                        <SearchForm params={params} />
                    </>
                )}
            </Formik>
        </>
    )
}


const AutoSave: React.FC<{debounceMs: number}> = ({ debounceMs }) => {
    const formik = useFormikContext();
    const [_, setLastSaved] = React.useState("");
    const debouncedSubmit = React.useCallback(
        debounce(() => {formik.submitForm().then(() => setLastSaved(new Date().toISOString()))}, debounceMs),
        [debounceMs, formik.submitForm]
    );

    React.useEffect(() => {
        debouncedSubmit();
    }, [debouncedSubmit, formik.values]);

    return (<></>);
};
