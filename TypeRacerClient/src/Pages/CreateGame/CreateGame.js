import React, {useState, useEffect, useCallback} from "react";
import { useFunction } from "../../Providers/FunctionProvider/FunctionProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import './CreateGame.css'
import EndPoint from "../../EndPoint";

const CreateGame = () => {
    const {InvokeHubMethod, InfoMessage} = useFunction();
    const {gameTypes, gameLevels} = useGameState();
    const {connectionGUID} = useSocket();

    const [nickName, setNickName] = useState('')

    const [activeGameType, setActiveGameType] = useState(1);
    const [activeGameLevel, setActiveGameLevel] = useState(1);

    const onSubmit = async (e) => {
        if(nickName === ""){
            InfoMessage("Username is required")
        } 
        else {
            e.preventDefault();
            await InvokeHubMethod('CreateGame', nickName, activeGameType, activeGameLevel, connectionGUID);
        }
    };

    return(
        <div className="creategame-body">
            <h2>"Outtype, outpace, outpower—your speed and strategy will determine the champion on this track!"</h2>
            <div className="creategame-wrapper">
                 
                <div className="gamesettings">
                    <div className="gametype">
                        {gameTypes.map((type) => (
                            <EndPoint.Components.SButton
                                key={type.id}
                                isActive={activeGameType === type.id}
                                onClick={() => setActiveGameType(type.id)}
                            >
                                {type.gameTypeName}
                            </EndPoint.Components.SButton>
                        ))}
                    </div>

                    <div className="gamelevel">
                        {gameLevels.map((level) => (
                            <EndPoint.Components.SButton
                                key={level.id}
                                isActive={activeGameLevel === level.id}
                                onClick={() => setActiveGameLevel(level.id)}
                            >
                                {level.gameLevelName}
                            </EndPoint.Components.SButton>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <EndPoint.Components.SInput type="text"
                        name="nickName"
                        value={nickName}
                        onChange={(e) => {
                            setNickName(e.target.value)
                        }}
                        placeholder="| Username"
                        className="form-control">
                    </EndPoint.Components.SInput>
                    <EndPoint.Components.SButton onClick={onSubmit}>
                        Continue
                    </EndPoint.Components.SButton>
                </div>
            </div>
        </div>
    )
}

export default CreateGame;