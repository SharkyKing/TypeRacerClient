import React from "react";
import './PowerBoardPanel.css'

const PowerBoardPanel = ({playerPowers}) => {
    console.log(playerPowers)


    return (
        <>
           {playerPowers.length > 0 && playerPowers.map((power) => (
                <div key={power.id} className="powerBlock">
                    <div 
                        className="powerBlock-icon"
                        style={{ backgroundImage: `url(${power.imagePath})` }}
                    >
                    </div>
                    <div className="powerBlock-key">
                        <p>{power.playerPowerKey}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default PowerBoardPanel;
