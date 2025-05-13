import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client;

export const connectStomp = (onMessage: (msg: any) => void) => {
    const socket = new SockJS("http://localhost:9090/ws");
    const userId = localStorage.getItem("id");

    stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log("WebSocket connected");

            if (userId) {
                const topic = `/topic/notifications/${userId}`;
                console.log("Subscribing to:", topic);

                stompClient.subscribe(topic, (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        console.log("WebSocket message received:", notification);

                        try {
                            onMessage(notification);
                        } catch (callbackError) {
                            console.error("Error inside onMessage callback:", callbackError);
                        }

                    } catch (parseError) {
                        console.error("Failed to parse WebSocket message. Raw data:", message.body);
                        console.error("Parsing error:", parseError);
                    }
                });
            } else {
                console.warn("⚠️ No user ID found in localStorage. Cannot subscribe.");
            }
        },
        onStompError: (frame) => {
            console.error("STOMP error", frame.headers['message']);
        },
    });

    stompClient.activate();
};


export const disconnectStomp = () => {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
        console.log("WebSocket disconnected");
    }
};

export const getStompClient = () => stompClient;
