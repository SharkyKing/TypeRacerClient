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
            console.log("Game updated:", game);
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
        } else {
            console.log('Active game not found');
        }
    }, [gameState.id]);

    const updateGameState = (newState) => {
        setGameState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const findPlayer = (players) => {
        if (!players || !Array.isArray(players)) return null; 
        return players.find(player => player.socketID === connectionId); 
    };

    const fetchData = async (url, options = {}) => {
        try {
            const response = await axios.get(url, options);
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(response.data.$values, url)
            return response.data.$values;
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            navigate(EndPoint.Paths.GameMenu);
        }
    };

    const handleDone = (playerWon, currentPlayer) => {
        console.log(playerWon)

        const title = `Nobody won this game`;
        const text = "Be faster next time!";
        const gifUrl = 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGkweWlweTBuanJjeWN0d2xna3R2YzJ0YWVoZTRkNmZhMTV5MjZrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0GqssRweIhlz209i/giphy.gif' 
        
        if(playerWon.id > 0){
            title = playerWon.socketID === connectionId ? "You WON!" : `You lost :( - ${playerWon.nickName} won the game!`;
            text = playerWon.socketID === connectionId 
                ? "Congratulations!" 
                : `Better luck next time, ${currentPlayer.nickName}!`;
            gifUrl = playerWon.socketID === connectionId 
                ? 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGkweWlweTBuanJjeWN0d2xna3R2YzJ0YWVoZTRkNmZhMTV5MjZrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0GqssRweIhlz209i/giphy.gif' 
                : 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnBpM3dvYjgyYWdhaXJ0dzk3M2NkY3U3NzVzdzExamd6N2VkYTYweiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B4uP3h97Hi2UaqS0E3/giphy.gif';
        }


        

        Swal.fire({
            title: title,
            text: text,
            imageUrl: gifUrl,
            imageAlt: 'Custom GIF',
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/'); // Navigate to home on OK click
            }
        });
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
        <GameStateContext.Provider value={{ gameState, updateGameState, findPlayer, fetchData, alertMessage, handleDone }}>
            {children}
        </GameStateContext.Provider>
    );
}
