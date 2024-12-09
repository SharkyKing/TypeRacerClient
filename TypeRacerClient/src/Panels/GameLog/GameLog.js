import React, { useState, useEffect, useRef, useCallback} from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import './GameLog.css'
import EndPoint from "../../EndPoint";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDown } from '@fortawesome/free-solid-svg-icons';
import { useFunction } from "../../Providers/FunctionProvider/FunctionProvider";
import axios from "axios";

const GameLog = () => {
    const {connection,checkConnection} = useSocket();
    const {player, gameState} = useGameState();
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]); 
    const [gameLogMinimized, setGameLogMinimized] = useState(false)
    const gameLogRef = useRef(null);
    const {FetchData, AlertMessage} = useFunction();

    useEffect(() => {
        const setupGame = async () => {
            if (player) {
                checkConnection();

                connection.on('SendMessageToGame', handleMessage);

                return () => {
                    connection.off('SendMessageToGame', handleMessage);
                };
            }
        };

        setupGame();
    }, []);

    const handleInputKeyDown = async (event) => {
        if (event.key === "Enter") {
            if(!player || !gameState) return;
            
            let gameId = gameState.id;
            let playerId = player.id;
            connection.invoke('SendMessage', gameId, playerId, inputValue);
            setInputValue("");
        }else if (event.key === "ArrowUp") {
            try {
                let playerId = player.id;
                const response = await axios.get(EndPoint.ApiPaths.PlayerLastMessage(playerId));
                console.log(response)
                setInputValue(response.data); 
            } catch (error) {
                console.error("Error fetching last message:", error);
            }
        }
    };

    const handleMessage = useCallback(({ playerNickName, msg }) => {
        setMessages(prevMessages => [...prevMessages, { playerNickName, msg }]);
    }, []);

    useEffect(() => {
        if (gameLogRef.current) {
            gameLogRef.current.scrollTop = gameLogRef.current.scrollHeight;
        }
    }, [messages]);

    return (
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
    );
}

export default GameLog;
