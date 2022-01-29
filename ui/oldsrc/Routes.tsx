import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "../oldsrc/pages/Home/Home";
import { Register } from "../oldsrc/pages/Register/Register";
import { About } from "../oldsrc/pages/About/About";
import { Login } from "../oldsrc/pages/Login/Login"
import { Logout } from "../oldsrc/pages/Login/Logout"
import { AuthorizedCallback } from "../oldsrc/pages/Login/AuthorizedCallback";
import { NotFound } from "../oldsrc/pages/Errors/NotFound";
import { LoginFailure } from "../oldsrc/pages/Errors/LoginFailure";
import { isUserLoggedIn } from "../oldsrc/components/PageUserInfo";
import { Admin } from "../oldsrc/pages/Admin/Admin";

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
