import React, {useState, useEffect} from "react";
import { useSocket } from "../SocketProvider";
import './css/CreateGame.css'
import SButton from '../modules/SButton'
import SInput from '../modules/SInput'
import axios from "axios";

const CreateGame = () => {
    const [nickName, setNickName] = useState('')
    const {connection} = useSocket();

    const [gameTypes, setGameTypes] = useState([]);
    const [gameLevels, setGameLevels] = useState([]);

    const onChange = e =>{
        setNickName(e.target.value);
    }

     const checkConnection = async () => {
        if (connection) {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                } else {
                    console.log('Connection is already in a non-disconnected state:', connection.state);
                }
            } catch (error) {
                console.error('Connection failed: ', error);
            }
        }
    };

     const fetchGameSettings = async () => {
        try {
            const typesResponse = await axios.get('https://localhost:7146/api/game/types');
            console.log(typesResponse)
            if (typesResponse.request.status !== 200) {
                throw new Error(`HTTP error! status: ${typesResponse.status}`);
            }
            setGameTypes(typesResponse.data.$values);

            const levelsResponse = await axios.get('https://localhost:7146/api/game/levels');
            if (levelsResponse.request.status !== 200) {
                throw new Error(`HTTP error! status: ${levelsResponse.status}`);
            }
            setGameLevels(levelsResponse.data.$values);
        } catch (error) {
            console.error('Error fetching game settings:', error);
        }
    };

    useEffect(() => {
        fetchGameSettings();
        checkConnection();
    }, [connection]);

    const [activeGameType, setActiveGameType] = useState(1);
    const [activeGameLevel, setActiveGameLevel] = useState(1);

    const onSubmit = async (e) => {
        e.preventDefault();
        checkConnection();
        if (connection) {
            try {
                await connection.invoke('CreateGame', nickName, activeGameType, activeGameLevel);
                console.log('Game creation initiated');
            } catch (error) {
                console.error('Error creating game:', error);
            }
        } else {
            console.error('No SignalR connection available');
        }
    };

    const handleGameTypeChange = (type) => {
        setActiveGameType(type);
    };

    const handleGameLevelChange = (level) => {
        setActiveGameLevel(level);
    };

    return(
        <div className="creategame-body">
            <h2>"Outtype, outpace, outpower—your speed and strategy will determine the champion on this track!"</h2>
            <div className="creategame-wrapper">
                 
                <div className="gamesettings">
                    <div className="gametype">
                        {gameTypes.map((type) => (
                            <SButton
                                key={type.id}
                                isActive={activeGameType === type.id}
                                onClick={() => setActiveGameType(type.id)}
                            >
                                {type.gameTypeName}
                            </SButton>
                        ))}
                    </div>

                    <div className="gamelevel">
                        {gameLevels.map((level) => (
                            <SButton
                                key={level.id}
                                isActive={activeGameLevel === level.id}
                                onClick={() => setActiveGameLevel(level.id)}
                            >
                                {level.gameLevelName}
                            </SButton>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <SInput type="text"
                        name="nickName"
                        value={nickName}
                        onChange={onChange}
                        placeholder="| Username"
                        className="form-control">
                    </SInput>
                    <SButton onClick={onSubmit} className="btn btn-primary">
                        Continue
                    </SButton>
                </div>
            </div>
        </div>
    )
}

export default CreateGame;