package com.mcl.chit.chat.engine;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.DefaultManagedTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.StompWebSocketEndpointRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.logging.Logger;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger LOGGER = Logger.getLogger(WebSocketConfig.class.getName());

    public static final String WS_ENDPOINT = "/chit-chat";
    public static final String APP_ENDPOINT_PREFIX = "/app";
    public static final String BROADCAST_TOPIC = "/topic/chit-chat";

    @Value("${APP_DOMAIN:}")
    private String appDomain;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        StompWebSocketEndpointRegistration endpointRegistration = registry.addEndpoint(WS_ENDPOINT);
        LOGGER.info(String.format("APP_DOMAIN env variable resolved to %s", appDomain));
        if (appDomain != null && !appDomain.isBlank()) {
            // Add support for application running on SSL
            endpointRegistration.setAllowedOrigins(appDomain + ":443");
        }
        endpointRegistration.withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes(APP_ENDPOINT_PREFIX);
        registry.enableSimpleBroker(BROADCAST_TOPIC)
                 // Send heartbeat messages every 30 sec
                .setHeartbeatValue(new long[]{50000, 50000})
                 // Task scheduler needed when heartbeats are configured
                .setTaskScheduler(new DefaultManagedTaskScheduler());
    }

}
