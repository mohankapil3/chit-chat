import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ChatHeader from '../app/chat-header.js';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

it("renders with status prop", () => {
  act(() => {
    const status = {
        text: "Some Status",
        style: "Some Style"
    };
    render(<ChatHeader status={ status } />, container);
  });

  const componentWrapper = container.children.item(0);

  const statusWrapper = componentWrapper.children.item(1);
  expect(statusWrapper.textContent).toEqual("Status - Some Status");

  const statusLabel = statusWrapper.children.item(1);
  expect(statusLabel.className).toEqual("Some Style");
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
