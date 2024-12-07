import React, { useEffect, useRef } from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import EndPoint from "../../EndPoint";

import Swal from "sweetalert2";

import './TypeRacer.css';

const TypeRacer = () => {
    const {player, playerGameResults, wordStyles, currentStyleIndex,changeWordStyle} = useGameState();
    const {connection, navigate, connectionGUID, connectionId} = useSocket();

useEffect(() => {
    const handleDone = (playerWon) => {
        let gameResult;
        console.log(playerGameResults);

        if (playerWon?.id > 0) {
            gameResult = playerGameResults.find(item => item.id === (playerWon.connectionGUID === connectionGUID ? 1 : 2));
        } else {
            gameResult = playerGameResults.find(item => item.id === 3);
        }

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
        }
    };

    // Register the event listener
    connection.on('done', handleDone);

    // Cleanup logic
    return () => {
        console.log('Cleaning up handleDone listener');
        if (typeof connection.off === 'function') {
            connection.off('done', handleDone);
        } else {
            console.warn('connection.off is not a function');
        }
    };
}, [connection, connectionId, playerGameResults, connectionGUID, navigate]);


    return (
        <>
            <div className="typeracer-body">
                <div className="typeracer-wrapper">
                    <div className="gameinfo-wrapper">
                        <div className="countdown">
                            <EndPoint.Panels.CountDown/>
                        </div>
                        <EndPoint.Components.SButton            
                                    onClick={()=> changeWordStyle()}
                                    style={{
                                        width: '15rem',
                                        height: '2.5rem', 
                                        padding: '5px',  
                                        fontSize: '12pt', 
                                    }}                               
                            >
                                Word Style {currentStyleIndex + 1}/{wordStyles.length}
                        </EndPoint.Components.SButton  >
                        <h1 className="nickname">{player?.nickName || ""}</h1>
                    </div>
                    <div className="displaywords-wrapper">
                        <EndPoint.Panels.WordDisplay/>
                    </div>
                    <div className="input-wrapper">
                        <div className="forminput">
                            <EndPoint.Panels.InputForm/>
                        </div>
                        <div className="start">
                            <EndPoint.Panels.StartButton/>
                        </div>
                    </div>
                    <div className="powerboard">
                        <EndPoint.Panels.PowerBoardPanel/>
                    </div>
                    <div className="other-players">
                        <EndPoint.Panels.GamePlayersPanel/>
                    </div>
                </div>
            </div>
            <div>
                <EndPoint.Panels.GameLog/>
            </div>
        </>
    );
};

export default TypeRacer;
