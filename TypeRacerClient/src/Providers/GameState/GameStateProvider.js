import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "../Socket/SocketProvider";
import {useNavigate } from 'react-router-dom'
import EndPoint from "../../EndPoint";
import axios from "axios";
import Swal from "sweetalert2";
import { useFunction } from "../FunctionProvider/FunctionProvider";

const GameStateContext = createContext();

export const useGameState = () => {
    return useContext(GameStateContext);
}

export const GameStateProvider = ({ children }) => {
    const {connection, connectionId, navigate, connectionGUID} = useSocket();
    const {FetchData, AlertMessage} = useFunction();
    
    const [gameState, setGameState] = useState({ id: "", isOpen: false, players: [], words: [] });
    
    const [gameTypes, setGameTypes] = useState(JSON.parse(localStorage.getItem("gameTypes") || "[]"));
    const [gameLevels, setGameLevels] = useState(JSON.parse(localStorage.getItem("gameLevels") || "[]"));
    const [playerGameResults, setPlayerGameResults] = useState(JSON.parse(localStorage.getItem("playerGameResult") || "[]"));
    const [wordStyles, setWordStyles] = useState(JSON.parse(localStorage.getItem("wordStyles") || "[]"));

    const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

    const [player, setPlayer] = useState(null);

    const FindPlayer = (gameStateParam) => {
        if (!gameStateParam.players || !Array.isArray(gameStateParam.players)) {
            AlertMessage("Failed to load player game array");
            navigate(EndPoint.Paths.GameMenu);
        }
        return gameStateParam.players.find(player => player.connectionGUID === connectionGUID); 
    };

    const fetchGameData = useCallback(async () => {
        try {
            if(!gameTypes || gameTypes.length === 0){
                const gameTypesData = await FetchData(EndPoint.ApiPaths.GameTypes());
                if (Array.isArray(gameTypesData)) {
                    setGameTypes(gameTypesData);
                    localStorage.setItem("gameTypes", JSON.stringify(gameTypesData));
                } else {
                    AlertMessage("Failed to fetch game types");
                    navigate(EndPoint.Paths.GameMenu);
                }
            }
            if(!gameLevels || gameLevels.length === 0){
                const gameLevelsData = await FetchData(EndPoint.ApiPaths.GameLevels());
                if (Array.isArray(gameLevelsData)) {
                    setGameLevels(gameLevelsData);
                    localStorage.setItem("gameLevels", JSON.stringify(gameLevelsData));
                } else {
                    AlertMessage("Failed to fetch game levels");
                    navigate(EndPoint.Paths.GameMenu);
                }
            }
            if(!playerGameResults || playerGameResults.length === 0){
                const playerGameResultData = await FetchData(EndPoint.ApiPaths.PlayerGameResults());
                if (Array.isArray(playerGameResultData)) {
                    setPlayerGameResults(playerGameResultData);
                    localStorage.setItem("playerGameResult", JSON.stringify(playerGameResultData));
                } else {
                    AlertMessage("Failed to fetch game player result data");
                    navigate(EndPoint.Paths.GameMenu);
                }
            }
            if(!wordStyles || wordStyles.length === 0){
                const wordStylesData = await FetchData(EndPoint.ApiPaths.WordStyles());            
                if (Array.isArray(wordStylesData)) {
                    setWordStyles(wordStylesData);
                    localStorage.setItem("wordStyles", JSON.stringify(wordStylesData));
                } else {
                    AlertMessage("Failed to fetch word styles");
                    navigate(EndPoint.Paths.GameMenu);
                }
            }
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [FetchData, navigate]);

    useEffect(() => {
        fetchGameData();
    }, [navigate] )

    useEffect(() => {
        const handleGameUpdate = (game) => {
            updateGameState(game);
            let updatedPlayer = FindPlayer(game);
            setPlayer(updatedPlayer)
            fetchGameData();
        };

        if (connection) {
            connection.on('UpdateGame', handleGameUpdate);
        }

        return () => {
            if (connection) {
                connection.off('UpdateGame', handleGameUpdate);
            }
        };
    }, [connectionId, gameState]);

    useEffect(() => {
        const handleDone = (playerWon) => {
            let gameResult;
            
            let possibleGameResultId = (playerWon.playerWon.connectionGUID === connectionGUID.toString() ? 1 : 2)

            console.log(playerGameResults, playerWon.playerWon.connectionGUID, connectionGUID.toString(), possibleGameResultId);

            if (playerWon?.playerWon.id > 0) {
                gameResult = playerGameResults.find(item => item.id === possibleGameResultId);
            } else {
                gameResult = playerGameResults.find(item => item.id === 3);
            }

            if (gameResult) {
                Swal.fire({
                    title: gameResult.title,
                    text: gameResult.text,
                    imageUrl: gameResult.gifUrl,
                    imageAlt: 'Game Result GIF',
                    confirmButtonText: 'OK',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(EndPoint.Paths.GameMenu);
                    }
                });
            }
        };

        // Register the event listener
        connection.on('done', handleDone);

        // Cleanup logic
        return () => {
            if (typeof connection.off === 'function') {
                connection.off('done', handleDone);
            } else {
                console.warn('connection.off is not a function');
            }
        };
    }, [connectionId, gameState, playerGameResults]);

    useEffect(() => {
        if (gameState.id !== "" && player) {
            navigate(EndPoint.Paths.TypeRacerById(gameState.id));
        } 
    }, [gameState.id]);

    const changeWordStyle = () => {
        if (wordStyles.length > 0) {
            setCurrentStyleIndex((prevIndex) => (prevIndex + 1) % wordStyles.length);
        }
    };

    const updateGameState = (newState) => {
        setGameState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    return (
        <GameStateContext.Provider value={{ gameState, updateGameState, player, gameTypes, gameLevels, wordStyles, currentStyleIndex,changeWordStyle}}>
            {children}
        </GameStateContext.Provider>
    );
}
