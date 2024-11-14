import React, { createContext, useContext, useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel  } from "@microsoft/signalr";
import {useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import EndPoint from "../../EndPoint";
import { v4 as uuidv4 } from 'uuid';

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {
    const navigate = useNavigate();

    const [connection, setConnection] = useState(null);
    const [connectionId, setConnectionId] = useState(null);
    const [connectionGUID, setConnectionGUID] = useState(localStorage.getItem("connectionGUID") || "")
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7146/gamehub') 
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();
            
        setConnection(newConnection);
    }, []);

    useEffect(() => {
        const startConnection = async () => {
            try {
                if (connection && (connection.state === "Disconnected")) {
                    console.log("CONNECTION")
                    await connection.start();
                    console.log("Connected to SignalR hub");

                    connection.on("ReceiveConnectionId", handleReceiveConnectionId);
                    setReconnectAttempts(0); // Reset attempts after successful connection
                }
            } catch (error) {
                console.error("Connection failed:", error);
                if (reconnectAttempts < maxReconnectAttempts) {
                    const retryDelay = Math.min(Math.pow(2, reconnectAttempts) * 1000, 30000);
                    setReconnectAttempts(reconnectAttempts + 1);
                    console.log(`Retrying connection in ${retryDelay / 1000} seconds (Attempt ${reconnectAttempts})...`);

                    setTimeout(startConnection, retryDelay);

                    // Show alert for retrying connection
                    Swal.fire({
                        icon: "info",
                        title: "Reconnecting...",
                        text: `Attempt ${reconnectAttempts} of ${maxReconnectAttempts}. Please wait.`,
                        timer: retryDelay,
                        showConfirmButton: false,
                    });
                } else {
                    // Max attempts reached, show error and navigate to main menu
                    Swal.fire({
                        icon: "error",
                        title: "Connection Error",
                        text: "Unable to connect to the server. Please check your internet connection or try again later.",
                        confirmButtonText: "Go to Main Menu",
                    }).then(() => {
                        navigate(EndPoint.Paths.GameMenu);
                    });
                }
            }
        };
        
        if (connection) {
            startConnection();
        }

        return () => {
            if (connection) {
                connection.off("ReceiveConnectionId", handleReceiveConnectionId);
            }
        };
    }, [connection, reconnectAttempts, navigate]);

    const handleReceiveConnectionId = (id) => {

        let existingConnectionGUID = localStorage.getItem("connectionGUID");

        if (!existingConnectionGUID) {
            existingConnectionGUID = uuidv4();
            setConnectionGUID(existingConnectionGUID)
            localStorage.setItem("connectionGUID", existingConnectionGUID);
            console.log(`Generated and Stored new Connection GUID: ${existingConnectionGUID}`);
        } else {
            console.log(`Using existing Connection GUID: ${existingConnectionGUID}`);
        }

        setConnectionId(id);
        localStorage.setItem("connectionId", id);
        console.log(`Received Connection ID: ${id}`);
    };

     const checkConnection = async () => {
        if (connection) {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                    console.log("Reconnected to SignalR hub");
                }
            } catch (error) {
                console.error("Reconnection failed:", error);
                Swal.fire({
                    icon: "warning",
                    title: "Reconnection Failed",
                    text: "Attempting to reconnect...",
                    timer: 3000,
                    showConfirmButton: false,
                });
                navigate(EndPoint.Paths.GameMenu);
            }
        }
    };

    useEffect(() => {
        checkConnection();
    }, [navigate])

    return (
        <SocketContext.Provider value={{ connectionId, connection, checkConnection, navigate, connectionGUID, checkConnection }}>
            {props.children}
        </SocketContext.Provider>
    );
}
