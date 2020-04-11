package com.mcl.chit.chat.engine;

import java.util.Objects;

public class ChatMessage {

    private final String sender;
    private final String content;

    // Required by deserialization frameworks
    private ChatMessage() {
        this(null, null);
    }

    public ChatMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public String getContent() {
        return content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMessage that = (ChatMessage) o;
        return Objects.equals(sender, that.sender) &&
                Objects.equals(content, that.content);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sender, content);
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "sender='" + sender + '\'' +
                ", content='" + content + '\'' +
                '}';
    }

}
