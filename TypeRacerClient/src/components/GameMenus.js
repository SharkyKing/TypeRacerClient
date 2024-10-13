import React from "react";
import {useNavigate } from 'react-router-dom'
import { useSocket } from "../SocketProvider";
import './css/GameMenus.css'
import SButton from '../modules/SButton'

const GameMenu = () =>{
    const {connection} = useSocket();
    const navigate = useNavigate();
    return(
    <div className="gamemenus-body">
        <h2>"Speed isn't your only weapon—master your power, outthink your rival, and race to victory one keystroke at a time!"</h2>
        <div className="gamemenus-wrapper">
            <SButton 
                type="button" 
                onClick={()=> navigate('/game/create')}
                className="create">
                    Create game
            </SButton>
            <SButton 
                type="button" 
                onClick={()=> navigate('/game/join')}
                className="join">
                    Join
            </SButton>
        </div>
    </div>
    )
}

export default GameMenu;