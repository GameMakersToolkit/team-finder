import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthCallback } from "./pages/AuthCallback/AuthCallback";
import { Home } from "./pages/Home/Home";
import { TestAuthenticatedPage } from "./pages/TestAuthenticatedPage/TestAuthenticatedPage";

const MyPost = React.lazy(() => import("./pages/MyPost"));

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/my-post" element={<MyPost />} />
    <Route path="/test-auth" element={<TestAuthenticatedPage />} />
    <Route path="/login/authorized" element={<AuthCallback />} />
    {/* TODO: replace with a proper Not Found page */}
    <Route path="*" element={<p>u wot m8</p>} />
  </Routes>
);
