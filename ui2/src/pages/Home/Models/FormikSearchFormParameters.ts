import {SearchParameters} from "./SearchParameters.ts";
import {FormikErrors, FormikTouched} from "formik";
import * as React from "react";

export type FormikSearchFormParameters = {
    values: SearchParameters,
    errors: FormikErrors<SearchParameters>,
    touched: FormikTouched<SearchParameters>,
    handleChange: {(e: React.ChangeEvent<any>): void, <T=string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any> ? void : ((e: (string | React.ChangeEvent<any>)) => void)},
    handleBlur: {(e: React.FocusEvent<any, Element>): void, <T=any>(fieldOrEvent: T): T extends string ? ((e: any) => void) : void},
    handleSubmit: (e?: (React.FormEvent<HTMLFormElement> | undefined)) => void,
    isSubmitting: boolean,
}