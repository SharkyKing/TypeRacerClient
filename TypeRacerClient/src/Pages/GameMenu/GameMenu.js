import React from "react";
import {useNavigate } from 'react-router-dom'
import './GameMenu.css'
import EndPoint from "../../EndPoint";

const GameMenu = () =>{
    const navigate = useNavigate();
    return(
    <div className="gamemenu-body">
        <h2>"Speed isn't your only weapon—master your power, outthink your rival, and race to victory one keystroke at a time!"</h2>
        <div className="gamemenu-wrapper">

            <EndPoint.Components.SButton 
                onClick={()=> navigate(EndPoint.Paths.CreateGame)}>
                    Create game
            </EndPoint.Components.SButton>

            <EndPoint.Components.SButton 
                onClick={()=> navigate(EndPoint.Paths.JoinGame)}>
                    Join
            </EndPoint.Components.SButton>

        </div>
    </div>
    )
}

export default GameMenu;