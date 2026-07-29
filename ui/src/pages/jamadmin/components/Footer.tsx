import { useContext, useState } from "react";
import { Form, Formik, Field } from "formik";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { toast } from "react-hot-toast";
import { getPreviewCacheKey } from "../../../common/components/JamPreviewStyling.tsx";
import { useUpdateJamMutation } from "./UseUpdateJamMutation.tsx";
import { Button } from "../../../common/components/Button.tsx";
import { DropzoneWithPreview } from "./DropzoneWithPreview.tsx";
import { useApiRequest } from "../../../api/apiRequest.ts";

type FooterFormParameters = {
  footerPrimaryLabel: string;
  footerPrimaryUrl: string;
  footerSecondaryLabel: string;
  footerSecondaryUrl: string;
  footerTertiaryLabel: string;
  footerTertiaryUrl: string;
};

export const Footer = () => {
  const apiRequest = useApiRequest();
  const theme = useContext(JamSpecificContext);

  // Track uploading state for each dropzone
  const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean}>({});
  const isAnyUploading = Object.values(uploadingStates).some(Boolean);

  const initialFormValues: FooterFormParameters = {
    footerPrimaryLabel: theme.styles["footer-primary-label"] ?? `${theme.name} homepage`,
    footerPrimaryUrl: theme.styles["footer-primary-url"] ?? "",
    footerSecondaryLabel: theme.styles["footer-secondary-label"] ?? "Community channel",
    footerSecondaryUrl: theme.styles["footer-secondary-url"] ?? "",
    footerTertiaryLabel: theme.styles["footer-tertiary-label"] ?? "Community Discord",
    footerTertiaryUrl: theme.styles["footer-tertiary-url"] ?? "",
  };

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
      toast.success(`Image upload complete!`);
    }
  };

  const onSubmitForm = (params: FooterFormParameters, setSubmitting: (a: boolean) => void) => {
    toast.dismiss();
    theme.styles = {
      ...theme.styles,
      "footer-primary-label": params.footerPrimaryLabel ?? "",
      "footer-primary-url": params.footerPrimaryUrl ?? "",
      "footer-secondary-label": params.footerSecondaryLabel ?? "",
      "footer-secondary-url": params.footerSecondaryUrl ?? "",
      "footer-tertiary-label": params.footerTertiaryLabel ?? "",
      "footer-tertiary-url": params.footerTertiaryUrl ?? "",
    };

    mutation.mutate(theme);
    setTimeout(() => {
      setSubmitting(false);
    }, 800);
    localStorage.removeItem(getPreviewCacheKey(theme.jamId));
  };

  const onSubmitSuccess = () => {
    toast.success(`Footer updated successfully!`);
  };

  const mutation = useUpdateJamMutation({ onSuccess: onSubmitSuccess });

  return (
    <Formik
      initialValues={initialFormValues}
      onSubmit={(values, { setSubmitting }) => onSubmitForm(values, setSubmitting)}
    >
      {(params) => (
        <Form className="c-form">
          <div className="c-admin-dasboard">
            <h2>Footer Links</h2>
            <p className="mb-8">Configure the footer navigation links with labels, URLs, and custom icons.</p>

            {/* Primary Footer Link */}
            <h3 className="text-2xl text-center mb-8 mt-8">Primary Footer Link</h3>
            <div className="c-form-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-16">
              <div>
                <label htmlFor="footerPrimaryLabel">Label</label>
              </div>
              <Field name="footerPrimaryLabel" type="text" className="form-block__field px-2 py-2" />
              <div>
                <label htmlFor="footerPrimaryUrl">URL</label>
              </div>
              <Field name="footerPrimaryUrl" type="text" className="form-block__field px-2 py-2" />
            </div>
            <div className="mb-16">
              <DropzoneWithPreview
                label="Primary Footer Icon"
                ctx="footer-primary-icon"
                currentImagePreview={theme.styles["footer-primary-icon-url"] ?? ""}
                onUploadImage={onUploadImage}
                isUploading={uploadingStates["footer-primary-icon"]}
              />
            </div>

            {/* Secondary Footer Link */}
            <h3 className="text-2xl text-center mb-8 mt-8">Secondary Footer Link</h3>
            <div className="c-form-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-16">
              <div>
                <label htmlFor="footerSecondaryLabel">Label</label>
              </div>
              <Field name="footerSecondaryLabel" type="text" className="form-block__field px-2 py-2" />
              <div>
                <label htmlFor="footerSecondaryUrl">URL</label>
              </div>
              <Field name="footerSecondaryUrl" type="text" className="form-block__field px-2 py-2" />
            </div>
            <div className="mb-16">
              <DropzoneWithPreview
                label="Secondary Footer Icon"
                ctx="footer-secondary-icon"
                currentImagePreview={theme.styles["footer-secondary-icon-url"] ?? ""}
                onUploadImage={onUploadImage}
                isUploading={uploadingStates["footer-secondary-icon"]}
              />
            </div>

            {/* Tertiary Footer Link */}
            <h3 className="text-2xl text-center mb-8 mt-8">Tertiary Footer Link</h3>
            <div className="c-form-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-16">
              <div>
                <label htmlFor="footerTertiaryLabel">Label</label>
              </div>
              <Field name="footerTertiaryLabel" type="text" className="form-block__field px-2 py-2" />
              <div>
                <label htmlFor="footerTertiaryUrl">URL</label>
              </div>
              <Field name="footerTertiaryUrl" type="text" className="form-block__field px-2 py-2" />
            </div>
            <div className="mb-16">
              <DropzoneWithPreview
                label="Tertiary Footer Icon"
                ctx="footer-tertiary-icon"
                currentImagePreview={theme.styles["footer-tertiary-icon-url"] ?? ""}
                onUploadImage={onUploadImage}
                isUploading={uploadingStates["footer-tertiary-icon"]}
              />
            </div>

            <div className="flex flex-row justify-center">
              <Button
                className="mt-4 bg-[var(--theme-primary)] rounded-xl w-[240px] mx-auto py-3 px-6 text-center text-lg font-semibold"
                type="submit"
                variant="primary"
                disabled={params.isSubmitting || mutation.isPending || isAnyUploading}
                style={{color: "white"}}
              >
                {mutation.isPending ? 'Submitting...' : isAnyUploading ? 'Uploading Image...' : 'Save Changes'}
              </Button>
            </div>
            {mutation.isSuccess && <div>Update successful!</div>}
            {mutation.isError && <div style={{ color: 'red' }}>Error: {mutation.error.message}</div>}
          </div>
        </Form>
      )}
    </Formik>
  );
};
