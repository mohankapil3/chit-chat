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

    private static final String NATIVE_HEADER_CHAT_NAME = "chat-name";
    private static final String SYSTEM_USER_NAME = "System";

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        LOGGER.fine("Inside handleWebSocketConnectListener - " + event);
    }

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        LOGGER.fine("Inside handleWebSocketSubscribeListener - " + event);
        setChatNameIntoSessionAndNotifyUsers(StompHeaderAccessor.wrap(event.getMessage()));
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        LOGGER.fine("Inside handleWebSocketDisconnectListener - " + event);
        notifyDisconnectionToOtherUsers(StompHeaderAccessor.wrap(event.getMessage()));
    }

    private void setChatNameIntoSessionAndNotifyUsers(StompHeaderAccessor headerAccessor) {
        String chatName = headerAccessor.getFirstNativeHeader(NATIVE_HEADER_CHAT_NAME);
        LOGGER.info(String.format("Received subscribe message, value for %s header is %s", NATIVE_HEADER_CHAT_NAME, chatName));
        if (chatName != null && !chatName.isBlank()) {
            headerAccessor.getSessionAttributes().put(NATIVE_HEADER_CHAT_NAME, chatName);
            messagingTemplate.convertAndSend(WebSocketConfig.BROADCAST_TOPIC,
                    new ChatMessage(SYSTEM_USER_NAME, String.format("%s joined chat", chatName)));
        }
    }

    private void notifyDisconnectionToOtherUsers(StompHeaderAccessor headerAccessor) {
        String chatName = (String) headerAccessor.getSessionAttributes().get(NATIVE_HEADER_CHAT_NAME);
        LOGGER.info(String.format("Received disconnect message from %s", chatName));
        if (chatName != null && !chatName.isBlank()) {
            messagingTemplate.convertAndSend(WebSocketConfig.BROADCAST_TOPIC,
                    new ChatMessage(SYSTEM_USER_NAME, String.format("%s left chat", chatName)));
        }
    }

}
