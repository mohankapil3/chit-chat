package com.mcl.chit.chat.engine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.logging.Logger;

@Component
public class WebSocketEventListener {

    private static final Logger LOGGER = Logger.getLogger(WebSocketEventListener.class.getName());

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        LOGGER.fine("Inside handleWebSocketConnectListener - " + event);
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        LOGGER.fine("Inside handleWebSocketSubscribeListener - " + event);

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String headerName = "chat-name";
        String chatNameHeader = headerAccessor.getFirstNativeHeader(headerName);
        LOGGER.info(String.format("Received new subscription event, value for %s header is %s", headerName, chatNameHeader));
        if (chatNameHeader != null && !chatNameHeader.isBlank()) {
            messagingTemplate.convertAndSend(WebSocketConfig.BROADCAST_TOPIC,
                    new ChatMessage("System", String.format("User '%s' joined", chatNameHeader)));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        LOGGER.fine("Inside handleWebSocketDisconnectListener - " + event);
    }

}
