import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";
import { renderWithContext } from "../../test-utils/renderWithContext";

test("renders", () => {
  renderWithContext(<Home />);
});
