package com.mcl.chit.chat.engine;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    public static final String MESSAGE_BROADCAST_ENDPOINT = "/broadcast-to-group";

    @MessageMapping(MESSAGE_BROADCAST_ENDPOINT)
    @SendTo(WebSocketConfig.BROADCAST_TOPIC)
    public ChatMessage broadcastToGroup(@Payload ChatMessage message) {
        return message;
    }

}
