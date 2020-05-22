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
    const userSummary = getByText("Your chat name - user3");
    expect(userSummary).toBeDefined();

    const messageBox = getByPlaceholderText("Enter message...");
    expect(messageBox).toBeDefined();

    const message1Container = getByText("Hello from user1");
    expect(message1Container).toBeDefined();

    const message2Container = getByText("Hello from user2");
    expect(message2Container).toBeDefined();
});

afterEach(cleanup);
