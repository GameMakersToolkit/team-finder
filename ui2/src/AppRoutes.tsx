import * as React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import { Home } from "./pages/Home/Home";

export const AppRoutes: React.FC = () => {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}/>
              {/* TODO: replace with a proper Not Found page */}
              <Route path="*" element={<p>u wot m8</p>}/>
          </Routes>
      </BrowserRouter>
  )
};
