import * as React from "react";

export const Logout: React.FC = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userData")

  // Redirect to homepage, we don't need to stay here!
  window.location.replace("/");

  return null
}
