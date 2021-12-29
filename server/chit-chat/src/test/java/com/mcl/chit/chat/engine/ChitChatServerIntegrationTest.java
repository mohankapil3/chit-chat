package com.mcl.chit.chat.engine;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ChitChatServer.class, webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class ChitChatServerIntegrationTest {

    private static final Logger LOGGER = Logger.getLogger(ChitChatServerIntegrationTest.class.getName());

    @Value("${local.server.port}")
    private int port;

    private String webSocketUrl;

    @Before
    public void setup() {
        webSocketUrl = "ws://localhost:" + port + WebSocketConfig.WS_ENDPOINT;
    }

    @Test
    public void sendAndReceiveMessagesOnWebSocket() throws Exception {
        var stompSession = createStompClient()
                .connect(webSocketUrl, new ChatMessageStompSessionHandler())
                .get(5, SECONDS);

        CompletableFuture<ChatMessage> serverCallBack = new CompletableFuture<>();

        stompSession.subscribe(WebSocketConfig.BROADCAST_TOPIC, new ChatMessageStompFrameHandler(serverCallBack));

        var expectedChatMessages = new ChatMessage("user1", "Hello there");
        var appMessageEndpoint = WebSocketConfig.APP_ENDPOINT_PREFIX + ChatController.MESSAGE_BROADCAST_ENDPOINT;
        stompSession.send(appMessageEndpoint, expectedChatMessages);

        var receivedMessage = serverCallBack.get(5, SECONDS);
        assertEquals(expectedChatMessages, receivedMessage);
    }

    private WebSocketStompClient createStompClient() {
        WebSocketStompClient client = new WebSocketStompClient(
                new SockJsClient(List.of(new WebSocketTransport(new StandardWebSocketClient())))
        );

        client.setMessageConverter(new MappingJackson2MessageConverter());
        return client;
    }

    private class ChatMessageStompFrameHandler implements StompFrameHandler {

        private final CompletableFuture<ChatMessage> messageCollector;

        private ChatMessageStompFrameHandler(CompletableFuture<ChatMessage> messageCollector) {
            this.messageCollector = messageCollector;
        }

        @Override
        public Type getPayloadType(StompHeaders stompHeaders) {
            return ChatMessage.class;
        }

        @Override
        public void handleFrame(StompHeaders stompHeaders, Object message) {
            messageCollector.complete((ChatMessage) message);
        }
    }

    private class ChatMessageStompSessionHandler extends StompSessionHandlerAdapter {

        @Override
        public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
            LOGGER.log(Level.SEVERE, "Exception in STOMP session handler", exception);
        }

        @Override
        public void handleTransportError(StompSession session, Throwable exception) {
            LOGGER.log(Level.SEVERE, "Transport error in STOMP session handler", exception);
        }
    }

}