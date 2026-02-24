import { Field, Form, Formik, FormikProps } from "formik";
import React, { useContext, useState } from "react";
import { JamSpecificContext } from "../../../common/components/JamSpecificStyling.tsx";
import { toast } from "react-hot-toast";
import { getPreviewCacheKey } from "../../../common/components/JamPreviewStyling.tsx";
import { useUpdateJamMutation } from "./UseUpdateJamMutation.tsx";
import { Button } from "../../../common/components/Button.tsx";
import CustomSelect from "../../jamhome/components/common/CustomSelect.tsx";

type FormikFormParameters = {
  status: string;
  startDateTime: string;
  endDateTime: string;
  discordEnabled: boolean;
  guildId?: string,
  guildInviteLink?: string,
  channelId?: string,
}

// Get current time in local timezone in order to prep for datetime-local input
const formatDateTimeLocal = (dateTime: string) => {
  const dt = new Date(dateTime);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0,16);
}

export const Dashboard = () => {
    const theme = useContext(JamSpecificContext)
    const [discordSectionOpen, setDiscordSectionOpen] = useState(theme.discordEnabled ?? true);
    const initialFormValues: FormikFormParameters = {
      // datetime-local inputs require no seconds and no timezone info
      status: theme.status,
      startDateTime: formatDateTimeLocal(theme.start),
      endDateTime: formatDateTimeLocal(theme.end),
      discordEnabled: theme.discordEnabled ?? true,
      guildInviteLink: theme.guildInviteLink ?? "",
      guildId: theme.guildId ?? "",
      channelId: theme.channelId ?? "",
    }

  const validateForm = (values: FormikFormParameters) => {
    const errors: Record<string, string> = {};
    const start = new Date(values.startDateTime)
    const end = new Date(values.endDateTime)

    if (start >= end) errors.invalid = "Jam end must be after jam start"

    // Toast all errors in validation
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).map(error => toast.error(error[1] as string))
    }

    return errors
  }

    const onSubmitForm = (params: FormikFormParameters, setSubmitting: (a: boolean) => void) => {
      toast.dismiss()
      // Why have I done it like this
      theme.status = params.status
      theme.start = params.startDateTime
      theme.end = params.endDateTime
      theme.discordEnabled = params.discordEnabled ?? false
      theme.guildId = params.guildId ?? ""
      theme.guildInviteLink = params.guildInviteLink ?? ""
      theme.channelId = params.channelId ?? ""

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
                  <h3 className="text-2xl text-center mb-4">Jam Status</h3>
                  <div className="c-form-block grid grid-cols-2 gap-x-8 mb-16">
                    <div>
                      <h4 className="text-lg">Set visibility</h4>
                      <p className="text-xs">Jams start hidden until set active</p>
                    </div>
                    <Field
                      name="status"
                      id="status"
                      className="c-dropdown form-block__field"
                      options={[
                        { value: "HIDDEN", label: "Hidden" },
                        { value: "VISIBLE", label: "Visible" }
                      ]}
                      component={CustomSelect}
                      placeholder={'Select option(s)'}
                      isMulti={false}
                    />
                  </div>


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


                  <h3 className="text-2xl text-center mb-4">Discord Integration</h3>
                  <div className="mb-4">
                    <p>Discord integration is optional. If enabled, only users in your community will be able to post and get DM links to other users. Otherwise, all logged-in users can post to your jam page.</p>
                    <p className="font-bold">Discord integration requires the FindYourJam.Team Discord bot to be added to your server.</p>
                    <p>If Discord integration is disabled, be aware that users who don't accept global DMs won't be able to be warned by the Team Finder.</p>
                  </div>
                  <div className="c-form-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label htmlFor="discordEnabled">Discord Integration</label>
                    </div>
                    <Field
                      as="select"
                      name="discordEnabled"
                      className="form-block__field px-2 py-2"
                      onChange={e => {
                        const value = e.target.value === "true";
                        params.setFieldValue("discordEnabled", value);
                        setDiscordSectionOpen(value);
                      }}
                      value={params.values.discordEnabled ? "true" : "false"}
                    >
                      <option value="true">Discord Enabled</option>
                      <option value="false">Discord Disabled</option>
                    </Field>
                  </div>

                  {discordSectionOpen && <DiscordIntegrationSettings />}

                  <h3 className="text-2xl text-center mb-4">Jam Admins</h3>
                  <div className="c-form-block grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-16">
                    {Object.values(theme?.adminInfo ?? {}).map(admin => (
                      <div className="bg-[var(--theme-primary)] rounded-xl mx-auto py-3 px-6 text-center font-semibold text-sm">
                        <p>{admin.username}</p>
                        <span className="text-xs">({admin.discordId})</span>
                      </div>
                    ))}
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

const DiscordIntegrationSettings: React.FC = () => {
  return (
      <div className="mb-8">
        <div className="c-form-block grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label>Discord guild ID</label>
            <p className="text-xs">Only users in your server will be able to post. Right-click your Discord server icon and select 'Copy Server ID'.</p>
          </div>
          <Field name="guildId">
            {({ field, form }: any) => (
              <input
                {...field}
                type="text"
                className="form-block__field px-2 py-2"
                placeholder="1470708876998344861"
                value={field.value ?? ""}
                onChange={e => form.setFieldValue("guildId", e.target.value ?? "")}
              />
            )}
          </Field>
          <div>
            <label>Server invite link</label>
            <p className="text-xs">This will be displayed to users who aren't in your community</p>
          </div>
          <Field name="guildInviteLink">
            {({ field, form }: any) => (
              <input
                {...field}
                type="text"
                className="form-block__field px-2 py-2"
                placeholder="https://discord.gg/abcdef"
                value={field.value ?? ""}
                onChange={e => form.setFieldValue("guildInviteLink", e.target.value ?? "")}
              />
            )}
          </Field>
          <div>
            <label>Server 'ping' channel ID</label>
            <p className="text-xs">When users try to get in touch, a fallback message which pings both users with an @name mention tag will be sent here.</p>
          </div>
          <Field name="channelId">
            {({ field, form }: any) => (
              <input
                {...field}
                type="text"
                className="form-block__field px-2 py-2"
                placeholder="1470709052504932456"
                value={field.value ?? ""}
                onChange={e => form.setFieldValue("channelId", e.target.value ?? "")}
              />
            )}
          </Field>
        </div>
      </div>
  )
}
