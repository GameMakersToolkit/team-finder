import React, { useEffect, useState } from "react";
import { getJamState, JamState } from "./utils/jamState";
import PageHeader from "./pages/PageHeader";
import { AppRoutes } from "./AppRoutes";
import Footer from "./pages/Footer/Footer";
import { Toaster } from "react-hot-toast";

export const App: React.FC = () => {
  const [jamState, setJamState] = useState<JamState>(getJamState())

  useEffect(() => {
    // Periodically check state so that transitions between states happen automatically
    const jamStateCheck = setInterval(() => setJamState(getJamState()), 1000)
    return () => clearTimeout(jamStateCheck)
  }, [])

  return (
    <>
      <PageHeader jamState={jamState} />
      <AppRoutes jamState={jamState} />
      <Footer />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </>
  )
}
