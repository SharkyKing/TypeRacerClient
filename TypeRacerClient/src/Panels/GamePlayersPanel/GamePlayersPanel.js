import React from "react";
import './GamePlayersPanel.css'
import { useGameState } from "../../Providers/GameState/GameStateProvider";

const GamePlayersPanel = ({players}) => {
    const {findPlayer, gameState} = useGameState();

    return (
        <> 
           
           {players && players.length > 0 && players.map((p) => {
                if (p.socketID !== findPlayer(players)?.socketID) {
                    return (
                        <div key={p.SocketID} className="player">
                            <div className="player-info">{p.id} - {p.nickName} -</div>
                            <div
                                style={{
                                    width: `${(p.currentWordIndex / gameState.words.split(" ").length) * 100}%`,
                                    backgroundColor: '#4CAF50',
                                    height: '10px',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                    );
                }
                return null;
            })}
        </>
    );
}

export default GamePlayersPanel;
