import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../Socket/SocketProvider";
import {useNavigate } from 'react-router-dom'
import EndPoint from "../../EndPoint";
import axios from "axios";
import Swal from "sweetalert2";

const GameStateContext = createContext();

export const useGameState = () => {
    return useContext(GameStateContext);
}

export const GameStateProvider = ({ children }) => {
    const [gameState, setGameState] = useState({ id: "", isOpen: false, players: [], words: [] });
    const navigate = useNavigate();
    const {connection, connectionId} = useSocket();

    useEffect(() => {
        const handleGameUpdate = (game) => {
            updateGameState(game);
        };

        if (connection) {
            connection.on('UpdateGame', handleGameUpdate);
        }

        return () => {
            if (connection) {
                connection.off('UpdateGame', handleGameUpdate);
            }
        };
    }, [connection]);

    useEffect(() => {
        if (gameState.id !== "") {
            navigate(EndPoint.Paths.TypeRacerById(gameState.id));
        } 
    }, [gameState.id]);

    const updateGameState = (newState) => {
        setGameState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const findPlayer = () => {
        if (!gameState.players || !Array.isArray(gameState.players)) return null; 
        return gameState.players.find(player => player.socketID === connectionId); 
    };

    const fetchData = async (url, options = {}) => {
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

    const alertMessage = (message, success = false) => {
        Swal.fire({
            title: message,
            icon: `${success ? "success": "error"}`,
            confirmButtonText: 'Okay',
            customClass: {
                confirmButton: 'custom-button'
            }
        });
    };

    return (
        <GameStateContext.Provider value={{ gameState, updateGameState, findPlayer, fetchData, alertMessage }}>
            {children}
        </GameStateContext.Provider>
    );
}
