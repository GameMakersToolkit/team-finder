import { login } from "../../api/login.ts";
import React, { useEffect } from "react";

export const Login: React.FC = () => {

  useEffect(() => {
    login()
  }, [])

  return <></>
}
