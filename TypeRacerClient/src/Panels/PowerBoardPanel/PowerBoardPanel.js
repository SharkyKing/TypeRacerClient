import React, {useEffect,  useState, useCallback} from "react";
import './PowerBoardPanel.css'
import EndPoint from "../../EndPoint";
import { useGameState } from '../../Providers/GameState/GameStateProvider';
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useFunction } from "../../Providers/FunctionProvider/FunctionProvider";

const PowerBoardPanel = () => {
    const {gameState, player} = useGameState();
    const {FetchData} = useFunction();
    const { connection } = useSocket();
    const [playerPowers, setPlayerPowers] = useState([]);
 
    const fetchPowers = useCallback(async () => {
        try {
            const powers = await FetchData(EndPoint.ApiPaths.PlayerPowers(player.id));
            setPlayerPowers(powers);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [FetchData]);

    useEffect(() => {
        if(playerPowers.length > 0 && !gameState.isOpen){
            connection.invoke('StartPowerCooldown', player.id);
        }
        else{
            fetchPowers()
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
