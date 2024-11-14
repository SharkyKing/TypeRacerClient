import React from "react";
import {useNavigate } from 'react-router-dom'
import './FailedToLoadPage.css'
import EndPoint from "../../EndPoint";

const FailedToLoadPage = () =>{
    const navigate = useNavigate();
    return(
    <div className="gamemenu-body">
        <h2>"Speed isn't your only weapon—master your power, outthink your rival, and race to victory one keystroke at a time!"</h2>
    </div>
    )
}

export default FailedToLoadPage;