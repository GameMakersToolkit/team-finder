import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthCallback } from "./pages/AuthCallback/AuthCallback";
import { FAQ } from "./pages/FAQ/FAQ";
import { Home } from "./pages/Home/Home";
import { Admin } from "./pages/Admin/Admin";
import { Logout } from "./pages/Logout/Logout";

const MyPost = React.lazy(() => import("./pages/MyPost"));

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/my-post" element={<MyPost />} />
    <Route path="/faq" element={<FAQ />} />
    <Route path="/login/authorized" element={<AuthCallback />} />
    <Route path="/logout" element={<Logout />} />
    {/* TODO: replace with a proper Not Found page */}
    <Route path="*" element={<p>u wot m8</p>} />
  </Routes>
);
