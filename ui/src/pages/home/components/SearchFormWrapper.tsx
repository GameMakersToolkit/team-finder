import * as React from "react";
import {Formik, useFormikContext} from 'formik';
import {SearchParameters, searchParametersFromQueryString} from "../models/SearchParameters.ts";
import {SearchForm} from "./SearchForm.tsx";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import {removeEmpty} from "../../../utils.ts"
import debounce from "just-debounce-it";

export const SearchFormWrapper: React.FC<{
    searchParams: URLSearchParams,
    setSearchParams: (value: SearchParameters) => void
}> = ({searchParams, setSearchParams}) => {

    const initialFormValues: SearchParameters = searchParametersFromQueryString(searchParams)

    const onSubmitForm = (values: any) => {
        const formattedValues: SearchParameters = removeEmpty({
            description: values['description'] || null,
            skillsPossessed: values['skillsPossessed']?.join(","),
            skillsSought: values['skillsSought']?.join(","),
            languages: values['languages']?.join(","),
            tools: values['tools']?.join(","),
            timezones: values['earliestTimezone'] && values['latestTimezone'] ? values['earliestTimezone'] + " " + values['latestTimezone'] : null,
            sortBy: values['sortBy'],
            sortDir: values['sortDir'],
        })
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
