import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { TestAuthenticatedPage } from "./pages/TestAuthenticatedPage/TestAuthenticatedPage";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/test-auth" element={<TestAuthenticatedPage />} />
    {/* TODO: replace with a proper Not Found page */}
    <Route path="*" element={<p>u wot m8</p>} />
  </Routes>
);
