import React, { useState } from "react";
import { useSocket } from "../SocketProvider";
import SButton from "../modules/SButton";

const StartBtn = ({ player, gameId }) => {
  const [showBtn, setShowBtn] = useState(true);
  const {connection} = useSocket();
  // Early return if player is null or undefined
  if (!player) return null;
  const playerId = player.id;
  const { isPartyLeader } = player;

  const onClickHandler = async () => {
    console.log("START TIME", player, gameId, connection.ConnectionId);
    connection.invoke('StartTimer', playerId, gameId);
    setShowBtn(false); 
  };

  return (
    <>
      {isPartyLeader && showBtn ? (
      <SButton 
        type="button" 
        onClick={onClickHandler} 
        className=""
      >
        Start game
      </SButton>
    ) : null}
    </>
   
  );
};

export default StartBtn;
