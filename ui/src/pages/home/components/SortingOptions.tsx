import React from "react";
import {Field} from "formik";
import CustomSelect, {CustomSelectOption} from "./common/CustomSelect.tsx";

const sortBy: CustomSelectOption[] = [
    {label: "Relevance", value: "score"},
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
        <div className="c-sorting-options grid grid-cols-2 grid-cols-[min-content_1fr] gap-2 items-center sm:block">
            <span>Sort</span>
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
            <span>by</span>
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