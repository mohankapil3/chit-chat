import React from "react";
import { render, cleanup } from '@testing-library/react';
import ChatRoom from '../app/chat-room.js';

it("ChatRoom renders with user summary, message text box and past messages", () => {
    // Arrange
    const message1 = { sender: "user1", content: "Hello from user1"};
    const message2 = { sender: "user2", content: "Hello from user2"};
    const messages = [message1, message2];
    const status = { text: "Connected", style: "style1" };

    // Act
    const { getByText, getByPlaceholderText } = render(
        <ChatRoom chatName="user3"
                status = { status }
                messages={ messages }
                onSendMessage= { ()=> {} }
                onDoLogout= { ()=> {} } />
    );

    // Assert
    expect(getByText("Your chat name - user3")).toBeDefined();
    expect(getByPlaceholderText("Enter message...")).toBeDefined();
    expect(getByText("Hello from user1")).toBeDefined();
    expect(getByText("Hello from user2")).toBeDefined();
});

afterEach(cleanup);
