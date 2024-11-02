import React, {useState} from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider.js";
import './JoinGame.css'
import EndPoint from "../../EndPoint.js";

const JoinGame = () => {
    const [nickName, setNickName] = useState('')
    const [gameId, setGameID] = useState('')

    const {invokeHubMethod} = useSocket();

    const onSubmit = async (e) => {
        e.preventDefault();
        await invokeHubMethod('JoinGame', gameId, nickName);
    };

    return(
        <div className="joingame-body">
            <h2>"Outtype, outpace, outpower—your speed and strategy will determine the champion on this track!"</h2>
            <div className="joingame-wrapper">
                <div className="form-group">
                    <EndPoint.Components.SInput type="text"
                        name="nickName"
                        value={gameId}
                        onChange={(e) => setGameID(e.target.value)}
                        placeholder="| Game ID"
                        className="form-control">
                    </EndPoint.Components.SInput>
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

export default JoinGame;