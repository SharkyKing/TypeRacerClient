// src/modules/SInput.js

import React, { forwardRef, useEffect, useState } from 'react';
import './SPowerUnit.css'; // Import styles
import { useSocket } from '../Providers/Socket/SocketProvider';
import { useGameState } from '../Providers/GameState/GameStateProvider';

const SPowerUnit = forwardRef(({ power }, ref) => {
    const {gameState} = useGameState();
    const { connection } = useSocket();
    const [cooldownTimer, setCooldownTimer] = useState({ powerUseId: "", time: "" });

    useEffect(() => {
        const handleTimerEvent = (data) => {
            if(power.id === data.powerUseId){
                setCooldownTimer(data);
            }
        };
        connection.on('cooldowntimer', handleTimerEvent);

        return () => {
            connection.off('cooldowntimer', handleTimerEvent);
        };
    }, [connection]);

    return (
        <div key={power.id} className="powerBlock" ref={ref}>
            <div 
                className="powerBlock-icon"
                style={{ 
                    backgroundImage: `url(${power.imagePath})`, 
                    backgroundColor: `${cooldownTimer.time > 0 || power.isUsed ? 'grey' : 'white'}`
                }}
            >
            </div>
            <div className='powerInfoHolder'
                style={{ 
                    backgroundColor: `${cooldownTimer.time > 0 || power.isUsed  ? 'grey' : 'white'}`
                }}>
                <div className="powerBlock-key">
                    <p>{power.playerPowerKey}</p>
                </div>
                <div className='powerBlock-time'>
                    <p>{cooldownTimer.time > 0 ? cooldownTimer.time : ''}</p>
                </div>
            </div>
            
        </div>
    );
});

export default SPowerUnit;
