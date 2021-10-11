import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

test("renders", () => {
  render(<Home />);
});
