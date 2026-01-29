import { CommonFields } from "./styling/CommonFields.tsx";
import { SkillsToolsLanguagesTimezones } from "./styling/SkillsToolsLanguagesTimezones.tsx";
import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { getPreviewCacheKey, getPreviewTheme } from "../../../common/components/JamPreviewStyling.tsx";
import { useApiRequest } from "../../../api/apiRequest.ts";
import { toast } from "react-hot-toast";
import { getPreviewThemeFields } from "./styling/PreviewThemeFields.ts";
import { Button } from "../../../common/components/Button.tsx";

const DropzoneWithPreview: React.FC<{
  label: string;
  ctx: string;
  currentImagePreview: string;
  onUploadImage: (file: File, ctx: string) => void;
}> = ({ label, ctx, currentImagePreview, onUploadImage }) => {
  const [preview, setPreview] = React.useState<string | null>(currentImagePreview);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      onUploadImage(file, ctx);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
        <h3 className="text-xl text-center mb-2">{label}</h3>
        <div
          className="bg-gray-600 border-2 border-gray-400 rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition"
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onClick={onClick}
          tabIndex={0}
          style={{ minHeight: 120 }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onChange}
          />
          {preview ? (
            <img src={preview} alt={label + ' preview'} className="max-h-40 max-w-full rounded shadow mb-2" />
          ) : (
            <span className="text-gray-500">Drag & drop or click to select an image</span>
          )}
        </div>
    </div>
  );
};

export const Styling: React.FC<{ forceStylingRedraw: () => void }> = ({ forceStylingRedraw }) => {
    const apiRequest = useApiRequest();
    const theme = useContext(JamSpecificContext)
    const previewTheme = getPreviewTheme(theme.jamId)
    const [themeFields, setThemeFields] = useState(getPreviewThemeFields(theme))

    // Accepts a context for the image type
    const onUploadImage = async (file: File, ctx: string) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiRequest(`/jams/${theme.jamId}/image?ctx=${ctx}`, {
            isFileUpload: true,
            method: "POST",
            body: formData,
        });

        if (response && typeof response === 'object' && 'message' in response) {
            console.log(`Presumed successful upload for ${ctx}; redrawing`)
            setTimeout(() => forceStylingRedraw(), 500);
        }
    }

    // Helper for dropzone file selection
    const onSubmitForm = (_: any, setSubmitting: (a: boolean) => void) => {
        toast.dismiss()
        previewTheme.styles = themeFields
          .map(f => {return {[f.name]: f.currentValue}})
          .reduce((a, b) => {return {...a, ...b}}, {})
        save(previewTheme)
        setTimeout(() => {
            setSubmitting(false)
        }, 800)
        localStorage.removeItem(getPreviewCacheKey(theme.jamId))
    }

    const onSubmitSuccess = () => {
        toast.success(`Theme updated successfully!`);
        forceStylingRedraw();
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
                        <h2 className="mb-8 text-3xl">Styling</h2>
                        <div className="grid grid-cols-3 gap-4 mb-16">
                            <DropzoneWithPreview
                              label="Background Image"
                              ctx="bg-image"
                              currentImagePreview={theme.bgImageUrl}
                              onUploadImage={onUploadImage}
                            />
                            <DropzoneWithPreview
                              label="Main Logo Image"
                              ctx="logo-large"
                              currentImagePreview={theme.logoLargeUrl}
                              onUploadImage={onUploadImage}
                            />
                            <DropzoneWithPreview
                              label="Small Logo Image"
                              ctx="logo-stacked"
                              currentImagePreview={theme.logoStackedUrl}
                              onUploadImage={onUploadImage}
                            />
                        </div>
                        <CommonFields
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <SkillsToolsLanguagesTimezones
                          themeFields={themeFields}
                          setThemeFields={setThemeFields} />
                        <Button
                          className="mt-4 bg-theme-d-7 rounded-xl w-full mx-auto py-3 px-6 text-center text-lg font-semibold"
                          type="submit"
                          variant="primary"
                          disabled={params.isSubmitting || mutation.isPending}
                          style={{color: "white"}}
                        >
                            {mutation.isPending ? 'Submitting...' : 'Submit Styling'}
                        </Button>
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
  opts?: UseMutationOptions<any, Error, UpdateJamMutationVariables>
): UseMutationResult<any, Error, UpdateJamMutationVariables> {
    const theme = useContext(JamSpecificContext)
    const apiRequest = useApiRequest();
    const queryClient = useQueryClient();
    const UPDATE_JAM_QUERY_KEY = ["jams", theme.jamId] as const;

    return useMutation({
        ...opts,
        mutationFn: async (variables) => {
            return await apiRequest(`/jams/${theme.jamId}`, {
                method: "PUT",
                body: variables,
            });
        },
        mutationKey: UPDATE_JAM_QUERY_KEY,
        onSuccess(data, variables, context) {
            queryClient.invalidateQueries({ queryKey: UPDATE_JAM_QUERY_KEY });
            if (opts && typeof opts.onSuccess === 'function') {
                opts.onSuccess(data, variables, context as any, undefined);
            }
        },
    });
}
