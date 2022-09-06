import React, { useEffect, useState } from "react";
import { getJamState, JamState } from "./utils/jamState";
import PageHeader from "./pages/PageHeader";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "react-hot-toast";

export const App: React.FC = () => {
  const [jamState, setJamState] = useState<JamState>(getJamState())

  useEffect(() => {
    // Periodically check state so that transitions between states happen automatically
    setInterval(() => setJamState(getJamState()), 1000)
  })

  return (
    <>
      <PageHeader jamState={jamState} />
      <AppRoutes jamState={jamState} />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  )
}
