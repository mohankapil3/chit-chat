import React from "react";
import { render, cleanup } from '@testing-library/react';
import ChitChatApp from '../app/chit-chat-app.js';

it("ChitChatApp renders successfully", () => {
    // Arrange and Act
    const { container } = render(<ChitChatApp />);

    // Assert
    const appRoot = container.children.item(0);
    expect(appRoot).toBeDefined();
    expect(appRoot.id).toEqual("chit-chat-app");
});

afterEach(cleanup);
