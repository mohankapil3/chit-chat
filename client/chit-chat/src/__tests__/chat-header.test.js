import React from "react";
import { render, cleanup } from '@testing-library/react';
import ChatHeader from '../app/chat-header.js';

it("ChatHeader renders with status prop", () => {
    // Arrange
    const status = {
        text: "Some Status",
        style: "Some Style"
    };

    // Act
    const { getByText } = render(<ChatHeader status={ status } />);

    // Assert
    const appHeader = getByText("ChitChat");
    expect(appHeader).toBeDefined();

    const statusLabel = getByText("Some Status");
    expect(statusLabel).toBeDefined();
    expect(statusLabel.className).toEqual("Some Style");
});

afterEach(cleanup);
