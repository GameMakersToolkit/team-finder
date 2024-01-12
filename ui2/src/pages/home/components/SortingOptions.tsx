import React from "react";
import {Field} from "formik";
import CustomSelect, {CustomSelectOption} from "./common/CustomSelect.tsx";

const sortBy: CustomSelectOption[] = [
    {label: "Team Size", value: "size"},
    {label: "Date Created", value: "createdAt"},
    {label: "Last Updated", value: "updatedAt"},
]

const sortDir: CustomSelectOption[] = [
    {label: "Lowest to Highest", value: "asc"},
    {label: "Highest to Lowest", value: "desc"}
]

export const SortingOptions: React.FC = ({}) => {
    return (
        <div className="c-sorting-options">
            Sort
            <span className="mx-2">
                <Field
                    name="sortBy"
                    className="c-dropdown w-auto form-block__field"
                    options={sortBy}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={false}
                />
            </span>
            by
            <span className="mx-2">
                <Field
                    name="sortDir"
                    className="c-dropdown w-auto form-block__field"
                    options={sortDir}
                    component={CustomSelect}
                    placeholder={"Select option(s)"}
                    isMulti={false}
                />
            </span>
        </div>
    )
}