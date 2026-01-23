import { CommonFields } from "./styling/CommonFields.tsx";
import { SkillsToolsLanguagesTimezones } from "./styling/SkillsToolsLanguagesTimezones.tsx";
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { Jam, JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { getPreviewCacheKey, getPreviewTheme } from "../../../common/components/JamPreviewStyling.tsx";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { toast } from "react-hot-toast";
import { getPreviewThemeFields } from "./styling/PreviewThemeFields.ts";

export const Styling = () => {
    const theme = useContext(JamSpecificContext)
    const previewTheme = getPreviewTheme(theme.jamId)
    const [themeFields, setThemeFields] = useState(getPreviewThemeFields(theme))

    const onSubmitForm = (values: any, setSubmitting: (a: boolean) => void) => {
        toast.dismiss()

        console.log("Submitting styling form with values:", values)
        console.log("Check against:", themeFields)
        previewTheme.styles = themeFields.map(f => {return {[f.name]: f.currentValue}}).reduce((a, b) => {return {...a, ...b}}, {})
        save(previewTheme)
        setTimeout(() => {
            setSubmitting(false)
        }, 800)
        localStorage.removeItem(getPreviewCacheKey(theme.jamId))
    }

    const onSubmitSuccess = () => {
        toast.success(`Theme updated successfully!`);
    }

    const { mutate: save } = useUpdateJamMutation();
    const mutation = useUpdateJamMutation({onSuccess: onSubmitSuccess})

    return (
        <Formik
            initialValues={{
                styles: previewTheme.styles
            }}
            onSubmit={ (_, { setSubmitting }) => onSubmitForm(themeFields, setSubmitting) }
        >
            {(params) => (
                <Form>
                    <div className="c-admin-styling">
                        <h2>Styling</h2>
                        <CommonFields
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <SkillsToolsLanguagesTimezones
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <button type="submit" disabled={params.isSubmitting || mutation.isPending}>
                            {mutation.isPending ? 'Submitting...' : 'Submit Styling'}
                        </button>
                        {mutation.isSuccess && <div>Update successful!</div>}
                        {mutation.isError && <div style={{ color: 'red' }}>Error: {mutation.error.message}</div>}
                    </div>
                </Form>
            )}
        </Formik>
    );
};


interface UpdateJamMutationVariables {
    jamId: string;
    // name: String? = null,
    // start: String? = null,
    // end: String? = null,
    // logoLargeUrl: String? = null,
    // logoStackedUrl: String? = null,
    styles: object,
}


function useUpdateJamMutation(
  opts?: UseMutationOptions<Jam, Error, UpdateJamMutationVariables>
): UseMutationResult<Jam, Error, UpdateJamMutationVariables> {
    const theme = useContext(JamSpecificContext)
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    const UPDATE_JAM_QUERY_KEY = ["jams", theme.jamId] as const;

    return useMutation({
        ...opts,
        mutationFn: async (variables) => {
            return await apiRequest<Jam>(`/jams/${theme.jamId}`, {
                method: "PUT",
                body: variables,
            });
        },
        mutationKey: UPDATE_JAM_QUERY_KEY,
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries(UPDATE_JAM_QUERY_KEY);
            opts?.onSuccess?.(data, variables, undefined, context);
        },
    });
}
