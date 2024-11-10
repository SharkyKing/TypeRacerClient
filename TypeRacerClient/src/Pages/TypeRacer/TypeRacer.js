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
    const {gameState, fetchData, findPlayer, handleDone} = useGameState();
    const {connection, checkConnection} = useSocket();

    //Utility
    const navigate = useNavigate();

    //Objects
    const { id, players, words, isOpen, isOver } = gameState;
    const [playerPowers, setPlayerPowers] = useState([]);
    const [gameLogMinimized, setGameLogMinimized] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]); 
    const gameLogRef = useRef(null);
    const fetchPowers = useCallback(async (playerId) => {
        try {
            const powers = await fetchData(EndPoint.ApiPaths.PlayerPowers(playerId));
            setPlayerPowers(powers);
            console.log(powers);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [fetchData]);

    useEffect(() => {
        if (gameLogRef.current) {
            gameLogRef.current.scrollTop = gameLogRef.current.scrollHeight;
        }
        console.log(messages);
    }, [messages]);

    useEffect(() => {
        if(gameState){
            if(gameState.id !== ""){
                if(gameState.players){
                    if(gameState.players.length > 0){
                        let player = findPlayer(); 

                        if(player){
                            fetchPowers(player.id);
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
                        <h1 className="nickname">{findPlayer()?.nickName || ""}</h1>
                    </div>
                    <div className="displaywords-wrapper">
                        <EndPoint.Panels.WordDisplay words={words} player={findPlayer()} />
                    </div>
                    <div className="input-wrapper">
                        <div className="forminput">
                            <EndPoint.Panels.InputForm isOpen={isOpen} isOver={isOver} gameId={id} player={findPlayer()}/>
                        </div>
                        <div className="start">
                            <EndPoint.Panels.StartButton player={findPlayer()} gameId={id} />
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
            <div className={`gamelog ${gameLogMinimized ? 'minimized': ''}`} >
                <div className={`gamelog-close ${gameLogMinimized ? 'minimized': ''}`} onClick={() => setGameLogMinimized(!gameLogMinimized)}>
                    <p>Chats</p>
                    <FontAwesomeIcon icon={faUpDown} className="gamelog-close-icon" onClick={() => setGameLogMinimized(!gameLogMinimized)}/>
                </div>
                <div className={`gamelog-context ${gameLogMinimized ? 'minimized': ''}`} ref={gameLogRef}>
                    {messages && messages.map((playerMsg, index) => (
                        <div key={index} className="logmsg">
                            <p><strong>{playerMsg.playerNickName}</strong>: {playerMsg.msg}</p>
                        </div>
                    ))}
                </div>
                <EndPoint.Components.SInput 
                    className={`${gameLogMinimized ? 'minimized': ''}`}  
                    onKeyDown={handleInputKeyDown}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>
        </>
    );
};

export default TypeRacer;
