import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import EndPoint from "../../EndPoint";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDown } from '@fortawesome/free-solid-svg-icons';

import './TypeRacer.css';

const TypeRacer = () => {
    //Providers
    const { gameState, fetchData, findPlayer } = useGameState();
    const { connection, checkConnection } = useSocket();

    //Utility
    const navigate = useNavigate();
    const [wordStyles, setWordStyles] = useState([]);
    const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
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

    const fetchWordStyles = useCallback(async () => {
        try {
            const WordStyles = await fetchData(EndPoint.ApiPaths.WordStyles());            
            if (Array.isArray(WordStyles)) {
                setWordStyles(WordStyles);
                console.log("Fetched WordStyles:", WordStyles);
            } else {
                console.error("Fetched WordStyles is not an array:", WordStyles);
            }
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [fetchData]);

    const fetchPlayerGameResults = async () => {
        try {
            const powers = await fetchData(EndPoint.ApiPaths.PlayerPowers(playerId));
            setPlayerPowers(powers);
            console.log(powers);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [fetchData]);


    const changeWordStyle = () => {
        if (wordStyles.length > 0) {
            setCurrentStyleIndex((prevIndex) => (prevIndex + 1) % wordStyles.length);
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
            await fetchWordStyles();
            console.log("Loading finished")
            setInitialLoaded(true);
        }
        console.log(messages);
    };

    useEffect(() => {
        if (gameState) {
            if (gameState.id !== "") {
                if (gameState.players) {
                    if (gameState.players.length > 0) {
                        let player = findPlayer();

                        if (player) {
                            fetchPowers(player.id);
                            fetchWordStyles();
                            checkConnection();

                            const handleDoneInner = ({ game, playerWon }) => {
                                handleDone(playerWon, player);
                            };

                            const handleMessage = ({ playerNickName, msg }) => {
                                setMessages((prevMessages) => [
                                    ...prevMessages,
                                    { playerNickName, msg }
                                ]);
                            };

                            connection.on('done', handleDoneInner);
                            connection.on('SendMessageToGame', handleMessage);
                            return () => {
                                connection.off('done', handleDoneInner);
                                connection.off('SendMessageToGame', handleMessage);
                            };
                        }
                    }
                }
            }
        }
    }, [connection, players, gameState, navigate, checkConnection, findPlayer, fetchPowers]);

    if (id === "") {
        navigate(EndPoint.Paths.GameMenu);
    }

    const handleInputKeyDown = (event) => {
        if (event.key === "Enter") {
            let player = findPlayer();
            let gameId = gameState.id;
            let playerId = player.id;
            console.log('SendMessage', gameId, playerId, inputValue);
            connection.invoke('SendMessage', gameId, playerId, inputValue);
            setInputValue("");
        }
    };

    return (
        <>
            <div className="typeracer-body">
                <div className="typeracer-wrapper">
                    <div className="gameinfo-wrapper">
                        <div className="countdown">
                            <EndPoint.Panels.CountDown />
                        </div>
                        <EndPoint.Components.SButton            
                                    onClick={()=> changeWordStyle()}
                                    style={{
                                        width: '10rem',
                                        height: '2.5rem', 
                                        padding: '5px',  
                                        fontSize: '12pt', 
                                    }}                               
                            >
                                Word Style
                        </EndPoint.Components.SButton  >
                        <h1 className="nickname">{findPlayer()?.nickName || ""}</h1>
                    </div>
                    <div className="displaywords-wrapper">
                        <EndPoint.Panels.WordDisplay gameState={gameState} player={findPlayer()}
                        WordStyles={wordStyles[currentStyleIndex] || {}}
                        />
                    </div>
                    <div className="input-wrapper">
                        <div className="forminput">
                            <EndPoint.Panels.InputForm isOpen={isOpen} isOver={isOver} gameId={id} player={findPlayer()} />
                        </div>
                        <div className="start">
                            <EndPoint.Panels.StartButton player={findPlayer()} gameId={id} />                            
                        </div>
                    </div>
                    <div className="powerboard">
                        <EndPoint.Panels.PowerBoardPanel playerPowers={playerPowers} />
                    </div>
                    <div className="other-players">
                        <EndPoint.Panels.GamePlayersPanel players={players} />
                    </div>
                </div>
            </div>

            {/* Button to change the word style */}
            <div className={`gamelog ${gameLogMinimized ? 'minimized' : ''}`} >
                <div className={`gamelog-close ${gameLogMinimized ? 'minimized' : ''}`} onClick={() => setGameLogMinimized(!gameLogMinimized)}>
                    <p>Chats</p>
                    <FontAwesomeIcon icon={faUpDown} className="gamelog-close-icon" onClick={() => setGameLogMinimized(!gameLogMinimized)} />
                </div>
                <div className={`gamelog-context ${gameLogMinimized ? 'minimized' : ''}`} ref={gameLogRef}>
                    {messages && messages.map((playerMsg, index) => (
                        <div key={index} className="logmsg">
                            <p><strong>{playerMsg.playerNickName}</strong>: {playerMsg.msg}</p>
                        </div>
                    ))}
                </div>
                <EndPoint.Components.SInput
                    className={`${gameLogMinimized ? 'minimized' : ''}`}
                    onKeyDown={handleInputKeyDown}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
        </>
    );
};

export default TypeRacer;
