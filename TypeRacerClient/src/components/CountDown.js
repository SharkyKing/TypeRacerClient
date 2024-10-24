import React, { useState, useEffect } from "react";
import { useSocket } from "../SocketProvider";

const CountDown = (props) => {
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
    }, []);


    return (
        <>
            <h1>{countDown}</h1>
            <h3>{msg}</h3>
        </>
    );
}

export default CountDown;
