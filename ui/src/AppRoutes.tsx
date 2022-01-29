import * as React from "react";
import { Routes, Route } from "react-router-dom";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<h1>Hello World, UI goes here</h1>} />
    {/* TODO: replace with a proper Not Found page */}
    <Route path="*" element={<p>u wot m8</p>} />
  </Routes>
);
