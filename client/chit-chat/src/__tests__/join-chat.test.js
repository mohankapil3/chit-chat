import React from "react";
import { render, cleanup } from '@testing-library/react';
import JoinChat from '../app/join-chat.js';

it("JoinChat renders with username input text box", () => {
    // Arrange
    const status = { text: "Not Connected", style: "style1" };

    // Act
    const { getByText, getByRole } = render(
        <JoinChat status = { status } onJoinChat= { ()=> {} } />
    );

    // Assert
    expect(getByText("Enter name")).toBeDefined();
    expect(getByRole("textbox").id).toEqual("textbox-chat-name");
    expect(getByText("Join room")).toBeDefined();
});

afterEach(cleanup);
