import {AddMessage} from "../../components/StatusMessenger";

export const tryPerformAction = async (callableFunction: () => Promise<Response>): Promise<void> => {
  try {
    const res = await callableFunction();

    if (res.status != 200) {
      AddMessage("bg-red-500", "There was an error trying to perform this action. Please try again.");
      return;
    }

    AddMessage("bg-primary-dark", "Action successful. Refresh page to update list.");
  } catch (e) {
    AddMessage("bg-red-500", "Something went wrong - check JS Console for more details.");
    console.error(e);
  }
}
