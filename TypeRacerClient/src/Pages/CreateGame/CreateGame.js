import React, {useState, useEffect, useCallback} from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import { useGameState } from "../../Providers/GameState/GameStateProvider";
import './CreateGame.css'
import EndPoint from "../../EndPoint";

const CreateGame = () => {
    const [nickName, setNickName] = useState('')
    const {invokeHubMethod} = useSocket();
    const {fetchData} = useGameState();

    const [gameTypes, setGameTypes] = useState([]);
    const [gameLevels, setGameLevels] = useState([]);

    const [activeGameType, setActiveGameType] = useState(1);
    const [activeGameLevel, setActiveGameLevel] = useState(1);

    const fetchGameSettings = useCallback(async () => {
        try {
            if(!gameTypes || gameTypes.length === 0){
                const gameTypes = await fetchData(EndPoint.ApiPaths.GameTypes());
                setGameTypes(gameTypes);
            }
            if(!gameLevels || gameLevels.length === 0){
                const gameLevels = await fetchData(EndPoint.ApiPaths.GameLevels());
                setGameLevels(gameLevels);
            }
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchGameSettings();
    }, [fetchGameSettings]);

    

    const onSubmit = async (e) => {
        e.preventDefault();
        await invokeHubMethod('CreateGame', nickName, activeGameType, activeGameLevel);
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
                        onChange={(e) => setNickName(e.target.value)}
                        placeholder="| Username"
                        className="form-control">
                    </EndPoint.Components.SInput>
                    <EndPoint.Components.SButton onClick={onSubmit} className="btn btn-primary">
                        Continue
                    </EndPoint.Components.SButton>
                </div>
            </div>
        </div>
    )
}

export default CreateGame;