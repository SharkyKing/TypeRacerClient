import React, { useEffect, useRef } from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import EndPoint from "../../EndPoint";

import Swal from "sweetalert2";

import './TypeRacer.css';

const TypeRacer = () => {
    const {connection, navigate, connectionGUID, connectionId} = useSocket();
    const {player, playerGameResults, wordStyles, currentStyleIndex,changeWordStyle} = useGameState();
    
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
