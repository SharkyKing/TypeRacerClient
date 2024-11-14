import React, { createContext, useContext, useState, useEffect } from "react";
import {useNavigate } from 'react-router-dom'
import EndPoint from "../../EndPoint";
import axios from "axios";
import Swal from "sweetalert2";
import { useGameState } from "../GameState/GameStateProvider";
import { useSocket } from "../Socket/SocketProvider";

const FunctionContext = createContext();

export const useFunction = () => {
    return useContext(FunctionContext);
}

export const FunctionProvider = ({ children }) => {
    const navigate = useNavigate();
    const {connection, checkConnection} = useSocket();

    const FetchData = async (url, options = {}) => {
        try {
            const response = await axios.get(url, options);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.data.$values;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            navigate(EndPoint.Paths.GameMenu);
        }
    };

    const AlertMessage = (message, success = false) => {
        Swal.fire({
            title: message,
            icon: `${success ? "success": "error"}`,
            confirmButtonText: 'Okay',
            customClass: {
                confirmButton: 'custom-button'
            }
        });
    };

     const InfoMessage = (message) => {
        Swal.fire({
            position: "top-end",
            icon: "info",
            text: message,
            showConfirmButton: false,
            timer: 1000,
        });
    };

    const InvokeHubMethod = async (methodName, ...args) => {
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
        <FunctionContext.Provider value={{ FetchData, AlertMessage,InfoMessage, InvokeHubMethod }}>
            {children}
        </FunctionContext.Provider>
    );
}
