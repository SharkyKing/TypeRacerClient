import React, { useState, useEffect } from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import './CountDown.css'

const CountDown = ({player, gameState}) => {
    const {connection} = useSocket();
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
