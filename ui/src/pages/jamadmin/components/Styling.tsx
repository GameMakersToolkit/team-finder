import { CommonFields } from "./styling/CommonFields.tsx";
import { SkillsToolsLanguagesTimezones } from "./styling/SkillsToolsLanguagesTimezones.tsx";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { getPreviewCacheKey, getPreviewTheme } from "../../../common/components/JamPreviewStyling.tsx";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { toast } from "react-hot-toast";
import { getPreviewThemeFields } from "./styling/PreviewThemeFields.ts";
import { Button } from "../../../common/components/Button.tsx";
import { useUpdateJamMutation } from "./UseUpdateJamMutation.tsx";
import { DropzoneWithPreview } from "./DropzoneWithPreview.tsx";

export const Styling: React.FC<{ forceStylingRedraw: () => void }> = ({ forceStylingRedraw }) => {
    const apiRequest = useApiRequest();
    const theme = useContext(JamSpecificContext)
    const previewTheme = getPreviewTheme(theme.jamId)
    const [themeFields, setThemeFields] = useState(getPreviewThemeFields(theme))

    // Track uploading state for each dropzone
    const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean}>({});
    const isAnyUploading = Object.values(uploadingStates).some(Boolean);

    // Accepts a context for the image type
    const onUploadImage = async (file: File, ctx: string, setUploading: (v: boolean) => void) => {
        setUploading(true);
        setUploadingStates(prev => ({ ...prev, [ctx]: true }));
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiRequest(`/jams/${theme.jamId}/image?ctx=${ctx}`, {
            isFileUpload: true,
            method: "POST",
            body: formData,
        });

        setUploading(false);
        setUploadingStates(prev => ({ ...prev, [ctx]: false }));
        if (response && typeof response === 'object' && 'message' in response) {
            setTimeout(() => forceStylingRedraw(), 500);
            toast.success(`Image upload complete!`);
        }
    }

    // Helper for dropzone file selection
    const onSubmitForm = (_: any, setSubmitting: (a: boolean) => void) => {
        toast.dismiss()
        previewTheme.styles = themeFields
          .map(f => {return {[f.name]: f.currentValue}})
          .reduce((a, b) => {return {...a, ...b}}, {})
        mutation.mutate(previewTheme)
        setTimeout(() => {
            setSubmitting(false)
        }, 800)
        localStorage.removeItem(getPreviewCacheKey(theme.jamId))
    }

    const onSubmitSuccess = () => {
        toast.success(`Theme updated successfully!`);
        forceStylingRedraw();
    }

    const mutation = useUpdateJamMutation({onSuccess: onSubmitSuccess})

    return (
        <Formik
            initialValues={{
                styles: previewTheme.styles
            }}
            onSubmit={ (_, { setSubmitting }) => onSubmitForm(themeFields, setSubmitting) }
        >
            {(params) => (
                <Form className="c-form">
                    <div className="c-admin-styling">
                        <h2 className="mb-4 text-3xl">Styling</h2>
                        <h3 className="mb-8 text-center text-xl bold text-yellow-500">Note: images will update immediately</h3>
                        <div className="grid grid-cols-4 gap-4 mb-16">
                            <DropzoneWithPreview
                              label="Background Image"
                              ctx="bg-image"
                              currentImagePreview={theme.bgImageUrl}
                              onUploadImage={onUploadImage}
                              isUploading={uploadingStates['bg-image']}
                            />
                            <DropzoneWithPreview
                              label="Main Logo Image"
                              ctx="logo-large"
                              currentImagePreview={theme.logoLargeUrl}
                              onUploadImage={onUploadImage}
                              isUploading={uploadingStates['logo-large']}
                            />
                            <DropzoneWithPreview
                              label="Home Button Image"
                              ctx="logo-stacked"
                              currentImagePreview={theme.logoStackedUrl}
                              onUploadImage={onUploadImage}
                              isUploading={uploadingStates['logo-stacked']}
                            />
                            <DropzoneWithPreview
                              label="Favicon"
                              ctx="favicon"
                              currentImagePreview={theme.faviconUrl}
                              onUploadImage={onUploadImage}
                              isUploading={uploadingStates['favicon']}
                            />
                        </div>
                        <CommonFields
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <SkillsToolsLanguagesTimezones
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <Button
                          className="mt-4 bg-[var(--theme-primary)] rounded-xl w-full mx-auto py-3 px-6 text-center text-lg font-semibold"
                          type="submit"
                          variant="primary"
                          disabled={params.isSubmitting || mutation.isPending || isAnyUploading}
                          style={{color: "white"}}
                        >
                            {mutation.isPending ? 'Submitting...' : isAnyUploading ? 'Uploading Image...' : 'Save Changes'}
                        </Button>
                        {mutation.isSuccess && <div>Update successful!</div>}
                        {mutation.isError && <div style={{ color: 'red' }}>Error: {mutation.error.message}</div>}
                    </div>
                </Form>
            )}
        </Formik>
    );
};
