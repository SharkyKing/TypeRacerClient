import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import EndPoint from "../../EndPoint";

import './TypeRacer.css';

const TypeRacer = () => {
    //Providers
    const {gameState, fetchData, findPlayer, handleDone} = useGameState();
    const {connection, checkConnection} = useSocket();

    //Utility
    const navigate = useNavigate();

    //Objects
    const { id, players, words, isOpen, isOver } = gameState;
    const [playerPowers, setPlayerPowers] = useState([]);

    const fetchPowers = useCallback(async () => {
        try {
            const powers = await fetchData(EndPoint.ApiPaths.Powers());
            setPlayerPowers(powers);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchPowers();
    }, [fetchPowers]);

    useEffect(() => {
        let player = findPlayer(players);

        checkConnection();

        const handleDoneInner = ({ game, playerWon }) => {
            handleDone(playerWon, player);
        };

        connection.on('done', handleDoneInner);
        return () => {
            connection.off('done', handleDoneInner);
        };
    }, [connection, players, gameState, navigate, checkConnection, findPlayer]);

    if (id === "") {
        navigate(EndPoint.Paths.GameMenu);
    }

    return (
        <div className="typeracer-body">
            <div className="typeracer-wrapper">
                <div className="gameinfo-wrapper">
                    <div className="countdown">
                        <EndPoint.Panels.CountDown />
                    </div>
                    <h1 className="nickname">{findPlayer(players)?.nickName || ""}</h1>
                </div>
                <div className="displaywords-wrapper">
                    <EndPoint.Panels.WordDisplay words={words} player={findPlayer(players)} />
                </div>
                <div className="input-wrapper">
                    <div className="forminput">
                        <EndPoint.Panels.InputForm isOpen={isOpen} isOver={isOver} gameId={id} />
                    </div>
                    <div className="start">
                        <EndPoint.Panels.StartButton player={findPlayer(players)} gameId={id} />
                    </div>
                </div>
                <div className="powerboard">
                    <EndPoint.Panels.PowerBoardPanel playerPowers={playerPowers}/>
                </div>
                <div className="other-players">
                    <EndPoint.Panels.GamePlayersPanel players={players}/>
                </div>
            </div>
        </div>
    );
};

export default TypeRacer;
