import * as React from "react";
import { screen } from "@testing-library/react";
import { Home } from "./Home";
import { renderWithContext } from "../../test-utils/renderWithContext";

test("fetches team list", async () => {
  renderWithContext(<Home />);
  expect(
    await screen.findByText(
      /This is how your team will look like in the Team Finder list!/
    )
  ).not.toBe(null);
});
