import React, {useState, useEffect} from "react";
import { useSocket } from "../SocketProvider.js";
import './css/JoinGame.css'
import SButton from '../modules/SButton.js'
import SInput from '../modules/SInput.js'

const JoinGame = () => {
    const [nickName, setNickName] = useState('')
    const [gameId, setGameID] = useState('')

    const {connection} = useSocket();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            if (connection) {
                try {
                    if (connection.state === "Disconnected") {
                        await connection.start(); // Start connection if disconnected
                        setIsConnected(true);
                    } else {
                        console.log('Connection is already in a non-disconnected state:', connection.state);
                    }
                } catch (error) {
                    console.error('Connection failed: ', error);
                }
            }
        };
        checkConnection();
    }, [connection]);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (connection) {
            try {
                await connection.invoke('JoinGame', gameId, nickName);
                console.log('Game creation initiated');
            } catch (error) {
                console.error('Error creating game:', error);
            }
        } else {
            console.error('No SignalR connection available');
        }
    };

    const onChangeNickname = e =>{
        setNickName(e.target.value);
    }

    const onChangeGameID = e =>{
        setGameID(e.target.value);
    }

    return(
        <div className="joingame-body">
            <h2>"Outtype, outpace, outpower—your speed and strategy will determine the champion on this track!"</h2>
            <div className="joingame-wrapper">
                <div className="form-group">
                    <SInput type="text"
                        name="nickName"
                        value={gameId}
                        onChange={onChangeGameID}
                        placeholder="| Game ID"
                        className="form-control">
                    </SInput>
                    <SInput type="text"
                        name="nickName"
                        value={nickName}
                        onChange={onChangeNickname}
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

export default JoinGame;