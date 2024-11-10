import React, {useEffect} from "react";
import './PowerBoardPanel.css'
import EndPoint from "../../EndPoint";
import { useGameState } from '../../Providers/GameState/GameStateProvider';
import { useSocket } from "../../Providers/Socket/SocketProvider";

const PowerBoardPanel = ({playerPowers}) => {
    const {gameState, findPlayer} = useGameState();
    const { connection } = useSocket();

    useEffect(() => {
        if(playerPowers.length > 0 && !gameState.isOpen){
            connection.invoke('StartPowerCooldown', findPlayer().id);
        }
    }, [playerPowers])

    return (
        <>
        <div className="powerBoardPanel">
             <p className="Suggestion">To use powers, type: //[Power][PlayerId]</p>
             <div className="powerBoardPowers">
                {playerPowers.length > 0 && playerPowers.map((power) => (
                    <EndPoint.Components.SPowerUnit key={power.id} power={power}/>
                ))}
            </div>
           
        </div>
        </>
    );
}
 
export default PowerBoardPanel;
