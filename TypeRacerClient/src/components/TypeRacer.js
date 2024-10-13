import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CountDown from './CountDown';
import StartBtn from './StartBtn';
import DisplayWords from './DisplayWords';
import Form from './Form';
import { useSocket } from "../SocketProvider";
import './css/TypeRacer.css';
import Swal from 'sweetalert2';

const TypeRacer = ({ gameState }) => {
    const {connection, connectionId} = useSocket();
    const navigate = useNavigate();

    const { id, players, words, isOpen, isOver } = gameState;

    // Function to find player based on connection ID
    const findPlayer = (players) => {
        if (!players || !Array.isArray(players)) return null; // Ensure players is an array
        return players.find(player => player.socketID === connectionId); // Use optional chaining
    };

    useEffect(() => {
        console.log(gameState);
        let player = findPlayer(players);
        
        // Ensure connection is defined before setting up event listeners
        if (connection) {
            const handleDone = ({ game, playerWon }) => {
                const title = playerWon.socketID === connectionId ? "You WON!" : `You lost :( - ${player.nickName} won the game!`;
                const text = playerWon.socketID === connectionId 
                    ? "Congratulations!" 
                    : `Better luck next time, ${player.nickName}!`;

                const gifUrl = playerWon.socketID === connectionId 
                    ? 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGkweWlweTBuanJjeWN0d2xna3R2YzJ0YWVoZTRkNmZhMTV5MjZrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0GqssRweIhlz209i/giphy.gif' 
                    : 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnBpM3dvYjgyYWdhaXJ0dzk3M2NkY3U3NzVzdzExamd6N2VkYTYweiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/B4uP3h97Hi2UaqS0E3/giphy.gif';

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

            connection.on('done', handleDone);

            return () => {
                connection.off('done', handleDone);
            };
        }
    }, [connection, players, gameState, navigate]);

    if (id === "") {
        navigate('/');
    }

    return (
        <div className="typeracer-body">
            <div className="typeracer-wrapper">
                <div className="gameinfo-wrapper">
                    <div className="countdown">
                        <CountDown />
                    </div>
                    <h1 className="nickname">{findPlayer(players)?.nickName || ""}</h1>
                </div>
                <div className="displaywords-wrapper">
                    <DisplayWords words={words} player={findPlayer(players)} />
                </div>
                <div className="forminput">
                    <Form isOpen={isOpen} isOver={isOver} gameId={id} />
                </div>
                <div className="start">
                    <StartBtn player={findPlayer(players)} gameId={id} />
                </div>
                <div className="other-players">
                    {players && players.map((p) => {
                        if (p.socketID !== findPlayer(players)?.socketID) {
                            return (
                                <div key={p.SocketID} className="player">
                                    <div className="player-info">{p.nickName}</div>
                                    <div
                                        style={{
                                            width: `${(p.currentWordIndex / words.split(" ").length) * 100}%`,
                                            backgroundColor: '#4CAF50',
                                            height: '10px',
                                            borderRadius: '5px',
                                        }}
                                    />
                                </div>
                            );
                        }
                        return null; // Return null for the current player
                    })}
                </div>
            </div>
        </div>
    );
};

export default TypeRacer;
