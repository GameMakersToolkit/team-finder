import * as React from "react";
import {Formik, useFormikContext} from 'formik';
import {SearchParameters, searchParametersFromQueryString} from "../models/SearchParameters.ts";
import {SearchForm} from "./SearchForm.tsx";
import {FormikSearchFormParameters} from "../models/FormikSearchFormParameters.ts";
import {removeEmpty} from "../../../utils.ts"
import debounce from "just-debounce-it";
import { SetURLSearchParams } from "react-router-dom";

export const SearchFormWrapper: React.FC<{
    searchParams: URLSearchParams,
    setSearchParams: SetURLSearchParams,
    resultCounts?: {
        current: number;
        total: number;
        filteredCount: number;
        totalCount: number;
    }
}> = ({searchParams, setSearchParams, resultCounts}) => {

    const initialFormValues: SearchParameters = searchParametersFromQueryString(searchParams)

    const onSubmitForm = (values: SearchParameters) => {
        // Remove the empty fields, so we don't clutter up the query string with &a=&b=...
        const trimmed = removeEmpty(values) as Partial<SearchParameters>
        const formattedValues: Record<string, string> = {}

        Object.entries(trimmed).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              formattedValues[key] = value.join(",");
            }
            return;
          }

          if (typeof value === "string") {
            formattedValues[key] = value;
          }
        });

        // If we only have one timezone flag set, don't send either in query string
        if (!values['timezoneStart'] || !values['timezoneEnd']) {
            delete formattedValues.timezoneStart
            delete formattedValues.timezoneEnd
        }

        // TODO: Oh god why
        if (searchParams.get('bookmarked')) {
          formattedValues.bookmarked = "true";
        } else {
          delete formattedValues.bookmarked;
        }

        if (values.availability?.length > 0) {
          formattedValues.availability = values.availability.join(",");
        } else {
          delete formattedValues.availability
        }

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
                        <SearchForm params={params} resultCounts={resultCounts} />
                    </>
                )}
            </Formik>
        </>
    )
}


const AutoSave: React.FC<{debounceMs: number}> = ({ debounceMs }) => {
    const formik = useFormikContext<SearchParameters>();
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
