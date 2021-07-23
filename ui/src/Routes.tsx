import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { About } from "./pages/About/About";
import { Login } from "./pages/Login/Login"
import { Logout } from "./pages/Login/Logout"
import { AuthorizedCallback } from "./pages/Login/AuthorizedCallback";
import { NotFound } from "./pages/Errors/NotFound";
import { LoginFailure } from "./pages/Errors/LoginFailure";
import { isUserLoggedIn } from "./components/PageUserInfo";
import { Admin } from "./pages/Admin/Admin";

export const Routes: React.FC = () => (
  <Switch>
    <Route exact={true} path="/">
      <Home />
    </Route>
    <Route exact={true} path="/about">
      <About />
    </Route>
    <Route exact={true} path="/admin">
      <Admin />
    </Route>
    <Route exact={true} path="/register">
      {isUserLoggedIn() ? <Register/> : <Login />}
    </Route>
    <Route exact={true} path="/logout">
      <Logout />
    </Route>
    <Route exact={true} path="/login/failed">
      <LoginFailure />
    </Route>
    <Route exact={true} path="/login/authorized">
      <AuthorizedCallback />
    </Route>

    {/* This always lives at the bottom of the list */}
    <Route path="/*">
      <NotFound />
    </Route>
  </Switch>
);
