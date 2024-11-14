import React from "react";
import './GamePlayersPanel.css'
import { useGameState } from "../../Providers/GameState/GameStateProvider";

const GamePlayersPanel = () => {
    const {player, gameState} = useGameState();
    
    return (
        <> 
           
           {gameState.players && gameState.players.length > 0 && gameState.players.map((p) => {
                if (p.socketID !== player.socketID) {
                    return (
                        <div key={p.id} className="player">
                            <div className="player-info">({p.id}) {p.nickName} -</div>
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
