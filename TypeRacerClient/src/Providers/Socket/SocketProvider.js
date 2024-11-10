import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {useNavigate } from 'react-router-dom'

import EndPoint from "../../EndPoint";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const navigate = useNavigate();

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

    const checkConnection = async () => {
        if (connection) {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                }
            } catch (error) {
                console.error('Connection failed: ', error);
                navigate(EndPoint.Paths.GameMenu);
            }
        }
    };

    useEffect(() => {
        checkConnection();
    }, [navigate])

    const invokeHubMethod = async (methodName, ...args) => {
        checkConnection();
        if (connection) {
            try {
                await connection.invoke(methodName, ...args);
            } catch (error) {
                console.error(`Error invoking ${methodName}:`, error);
                navigate(EndPoint.Paths.GameMenu);
            }
        } else {
            console.error("Connection is not available");
            navigate(EndPoint.Paths.GameMenu);
        }
    };

    return (
        <SocketContext.Provider value={{ connectionId, connection, checkConnection, invokeHubMethod }}>
            {props.children}
        </SocketContext.Provider>
    );
}
