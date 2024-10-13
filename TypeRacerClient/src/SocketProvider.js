import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const [connection, setConnection] = useState(null);
    const [connectionId, setConnectionId] = useState(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7146/gamehub') 
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        const startConnection = async () => {
            if (connection) {
                try {
                    await connection.start();
                    console.log('Connected to SignalR hub');

                    connection.on('gameCreated', (data) => {
                        console.log("Game created: ", data);
                    });

                    connection.on('gameCreationFailed', (error) => {
                        console.error("Game creation failed: ", error);
                    });

                    connection.on("ReceiveConnectionId", (connectionId) => {
                        setConnectionId(connectionId);
                    });
                } catch (error) {
                    console.error('Connection failed: ', error);
                }
            }
        };

        startConnection();
    }, [connection]);

    return (
        <SocketContext.Provider value={{ connectionId, connection }}>
            {props.children}
        </SocketContext.Provider>
    );
}
