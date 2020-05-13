package com.mcl.chit.chat.engine;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.DefaultManagedTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    public static final String WS_ENDPOINT = "/chit-chat";
    public static final String APP_ENDPOINT_PREFIX = "/app";
    public static final String BROADCAST_TOPIC = "/topic/chit-chat";

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(WS_ENDPOINT).withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes(APP_ENDPOINT_PREFIX);
        registry.enableSimpleBroker(BROADCAST_TOPIC)
                 // Send heartbeat messages every 30 sec
                .setHeartbeatValue(new long[]{30000, 30000})
                 // Task scheduler needed when heartbeats are configured
                .setTaskScheduler(new DefaultManagedTaskScheduler());
    }

}
