import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ChatRoom from '../app/chat-room.js';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders ChatRoom with some dummy user and messages", () => {
  const message1 = { sender: "user1", content: "Hello from user1"};
  const message2 = { sender: "user2", content: "Hello from user2"};
  const messages = [message1, message2];
  const status = { text: "Connected", style: "style1" };

  act(() => {
    render(<ChatRoom chatName="user3"
                     status = { status }
                     messages={ messages }
                     onSendMessage= { ()=> {} }
                     onDoLogout= { ()=> {} } />
    , container);
  });

  const componentWrapper = container.children.item(0);

  const chatHeaderWrapper = componentWrapper.children.item(0);
  expect(chatHeaderWrapper.textContent).toEqual("ChitChatStatus - Connected");

  const userNameWrapper = componentWrapper.children.item(1);
  expect(userNameWrapper.textContent).toEqual("Your chat name - user3");

  const chatMessage1 = componentWrapper.children.item(3);
  expect(chatMessage1.textContent).toEqual("user1: Hello from user1");

  const chatMessage2 = componentWrapper.children.item(4);
  expect(chatMessage2.textContent).toEqual("user2: Hello from user2");
});
