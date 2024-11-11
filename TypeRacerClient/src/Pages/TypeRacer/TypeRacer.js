import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import EndPoint from "../../EndPoint";

import Swal from "sweetalert2";

import './TypeRacer.css';

const TypeRacer = () => {
    const {gameState, fetchData, findPlayer} = useGameState();
    const {connection, connectionId} = useSocket();
    const navigate = useNavigate();

    const [playerGameResults, setPlayerGameResults] = useState([]);
    const [doneTriggered, setDoneTriggered] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const playerGameResultsRef = useRef([]);

    useEffect(() => {
        playerGameResultsRef.current = playerGameResults;
    }, [playerGameResults]);

    const handleDone = ({ playerWon }) => {
        if(!doneTriggered){

            let gameResult;
            const currentPlayerGameResults = playerGameResultsRef.current;

            if (playerWon?.id > 0) {
                gameResult = currentPlayerGameResults.find(item => item.id === (playerWon.socketID === connectionId ? 1 : 2));
            } else {
                gameResult = currentPlayerGameResults.find(item => item.id === 3);
            }
            console.log(gameResult, currentPlayerGameResults, connectionId);
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

                setDoneTriggered(true);
            }
        }
    };

    const fetchPlayerGameResults = async () => {
        try {
            const PlayerGameResultData = await fetchData(EndPoint.ApiPaths.PlayerGameResults());
            setPlayerGameResults(PlayerGameResultData);
            console.log(PlayerGameResultData);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    };

    useEffect(() => {
        connection.on('done', handleDone);
        return () => {
            connection.off('done', handleDone);
        };
    }, [doneTriggered, connectionId]);

    const InitialLoading = async () => {
        if(!initialLoaded){
            console.log("Initiating loading")
            await fetchPlayerGameResults();
            console.log("Loading finished")
            setInitialLoaded(true);
        }
    }

    useEffect(()=>{
        InitialLoading();
    }, [])

    return (
        <>
            <div className="typeracer-body">
                <div className="typeracer-wrapper">
                    <div className="gameinfo-wrapper">
                        <div className="countdown">
                            <EndPoint.Panels.CountDown player={findPlayer()} gameState={gameState}/>
                        </div>
                        <h1 className="nickname">{findPlayer()?.nickName || ""}</h1>
                    </div>
                    <div className="displaywords-wrapper">
                        <EndPoint.Panels.WordDisplay gameState={gameState} player={findPlayer()}/>
                    </div>
                    <div className="input-wrapper">
                        <div className="forminput">
                            <EndPoint.Panels.InputForm gameState={gameState} player={findPlayer()}/>
                        </div>
                        <div className="start">
                            <EndPoint.Panels.StartButton player={findPlayer()} gameState={gameState} />
                        </div>
                    </div>
                    <div className="powerboard">
                        <EndPoint.Panels.PowerBoardPanel player={findPlayer()}/>
                    </div>
                    <div className="other-players">
                        <EndPoint.Panels.GamePlayersPanel gameState={gameState}/>
                    </div>
                </div>
            </div>
            <div>
                <EndPoint.Panels.GameLog player={findPlayer()} gameState={gameState}/>
            </div>
        </>
    );
};

export default TypeRacer;
