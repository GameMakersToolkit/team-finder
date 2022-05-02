import * as React from "react";
import { screen } from "@testing-library/react";
import { Home } from "./Home";
import { renderWithContext } from "../../test-utils/renderWithContext";
import Modal from "react-modal";

// Suppress Modal.setAppElement, which totally doesn't work in unit tests
// See https://github.com/reactjs/react-modal/issues/632
jest.spyOn(Modal, "setAppElement")
    .mockImplementation(_ => _);

test("fetches team list", async () => {
  renderWithContext(<Home />);
  expect(
    await screen.findByText(
      /This is how your team will look like in the Team Finder list!/
    )
  ).not.toBe(null);
});
