import { Form, Formik, FormikProps } from "formik";
import { useContext } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { toast } from "react-hot-toast";
import { getPreviewCacheKey } from "../../../common/components/JamPreviewStyling.tsx";
import { useUpdateJamMutation } from "./UseUpdateJamMutation.tsx";
import { Button } from "../../../common/components/Button.tsx";

type FormikFormParameters = {
  startDateTime: string;
  endDateTime: string;
}

// Get current time in local timezone in order to prep for datetime-local input
const formatDateTimeLocal = (dateTime: string) => {
  const dt = new Date(dateTime);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0,16);
}

export const Dashboard = () => {
    const theme = useContext(JamSpecificContext)
    const initialFormValues = {
      // datetime-local inputs require no seconds and no timezone info
      startDateTime: formatDateTimeLocal(theme.start),//.replace(":00Z", ""),
      endDateTime: formatDateTimeLocal(theme.end)//.replace(":00Z", ""),
    }

  const validateForm = (values: FormikFormParameters) => {
    const errors = {}
    const start = new Date(values.startDateTime)
    const end = new Date(values.endDateTime)

    if (start >= end) errors["invalid"] = "Jam end must be after jam start"

    // Toast all errors in validation
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).map(error => toast.error(error[1] as string))
    }

    return errors
  }

    const onSubmitForm = (params: FormikFormParameters, setSubmitting: (a: boolean) => void) => {
      toast.dismiss()
      theme.start = params.startDateTime
      theme.end = params.endDateTime
      mutation.mutate(theme)
      setTimeout(() => {
        setSubmitting(false)
      }, 800)
      localStorage.removeItem(getPreviewCacheKey(theme.jamId))
    }

    const onSubmitSuccess = () => {
      toast.success(`Theme updated successfully!`);
    }

    const mutation = useUpdateJamMutation({onSuccess: onSubmitSuccess})

    const SetDateByOffset = (params: any, fieldName: string, offsetDays: number) => {
      const date = new Date(params.values.startDateTime)
      date.setDate(date.getDate() + offsetDays)
      params.setFieldValue(fieldName, formatDateTimeLocal(new Date(date).toISOString()))
    }

    return (
      <>
        <Formik
          initialValues={ initialFormValues }
          validate={ validateForm }
          validateOnBlur={ true }
          validateOnChange={ false }
          onSubmit={ (values, { setSubmitting }) => onSubmitForm(values, setSubmitting) }
        >
          {(params: FormikProps<FormikFormParameters>) => (
            <>
              <div className="c-admin-dasboard">
                <h2>Welcome!</h2>
                <Form className="c-form">
                  <h3 className="text-2xl text-center mb-4">Jam Timing</h3>
                  <div className="c-form-block grid grid-cols-2 gap-x-8 mb-16">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="startDateTime">Jam start</label>
                      <input
                        name="startDateTime"
                        type="datetime-local"
                        value={params.values.startDateTime}
                        onChange={params.handleChange}
                        onBlur={params.handleBlur}
                        className="form-block__field text-black py-1 px-2"
                      />
                      <span className="text-sm cursor-pointer bold" onClick={() => params.setFieldValue("startDateTime", formatDateTimeLocal(new Date().toISOString()))}>Now</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="endDateTime">Jam end</label>
                      <input
                        name="endDateTime"
                        type="datetime-local"
                        value={params.values.endDateTime}
                        onChange={params.handleChange}
                        onBlur={params.handleBlur}
                        className="form-block__field text-black py-1 px-2"
                      />
                      <div className="flex flex-row gap-2 justify-between">
                        <span className="text-sm cursor-pointer bold" onClick={() => SetDateByOffset(params, "endDateTime", 7)}>Start + 7 days</span>
                        <span className="text-sm cursor-pointer bold" onClick={() => SetDateByOffset(params, "endDateTime", 10)}>Start + 10 days</span>
                        <span className="text-sm cursor-pointer bold" onClick={() => SetDateByOffset(params, "endDateTime", 14)}>Start + 14 days</span>
                        <span className="text-sm cursor-pointer bold" onClick={() => SetDateByOffset(params, "endDateTime", 28)}>Start + 28 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center">
                    <Button
                      className="mt-4 bg-[var(--theme-primary)] rounded-xl w-[240px] mx-auto py-3 px-6 text-center text-lg font-semibold"
                      type="submit"
                      variant="primary"
                      disabled={params.isSubmitting || mutation.isPending}
                      style={{color: "white"}}
                    >
                      {mutation.isPending ? 'Submitting...' : 'Save Changes'}
                    </Button>
                  </div>
                  {mutation.isSuccess && <div>Update successful!</div>}
                  {mutation.isError && <div style={{ color: 'red' }}>Error: {mutation.error.message}</div>}
                </Form>
              </div>
            </>
          )}
        </Formik>
      </>
    )
}
