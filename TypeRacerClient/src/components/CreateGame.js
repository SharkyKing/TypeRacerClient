import React, {useState, useEffect} from "react";
import { useSocket } from "../SocketProvider";
import './css/CreateGame.css'
import SButton from '../modules/SButton'
import SInput from '../modules/SInput'

const CreateGame = () => {
    const [nickName, setNickName] = useState('')
    const {connection} = useSocket();
    const [isConnected, setIsConnected] = useState(false);

    const onChange = e =>{
        setNickName(e.target.value);
    }

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
                await connection.invoke('CreateGame', nickName);
                console.log('Game creation initiated');
            } catch (error) {
                console.error('Error creating game:', error);
            }
        } else {
            console.error('No SignalR connection available');
        }
    };

    return(
        <div className="creategame-body">
            <h2>"Outtype, outpace, outpower—your speed and strategy will determine the champion on this track!"</h2>
            <div className="creategame-wrapper">
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