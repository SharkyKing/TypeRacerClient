import React, { useState, useEffect } from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import './CountDown.css'

const CountDown = () => {
    const {connection} = useSocket();
    const {player, gameState} = useGameState();

    const [timer, setTimer] = useState({ countDown: "", msg: "" });
    const { countDown, msg } = timer;

    useEffect(() => {
        const handleTimerEvent = (data) => {
            setTimer(data);
        };
        connection.on('timerClient', handleTimerEvent);

        connection.on('done', ()=> {
            connection.removeListener('timerClient');
        })

        return () => {
            connection.off('timerClient', handleTimerEvent);
        };
    }, [connection]);


    return (
        <div className="countDown">
            <div className="timer">
                <h3>{msg} {">"} </h3>
                <h1>{countDown}</h1>
            </div>
            { gameState.gameTypeId == 2 &&
            <div className="gameInfo">
                <h3>Mistakes: {player.mistakeCount}</h3>
            </div>
            }
        </div>
    );
}

export default CountDown;
