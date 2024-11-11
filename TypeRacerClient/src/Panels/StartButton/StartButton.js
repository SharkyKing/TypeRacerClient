import React, { useState } from "react";
import { useSocket } from "../../Providers/Socket/SocketProvider";
import SButton from "../../Components/SButton";

const StartButton = ({ player, gameState }) => {
  const [showBtn, setShowBtn] = useState(true);
  const {connection} = useSocket();
  // Early return if player is null or undefined
  if (!player) return null;

  const onClickHandler = async () => {
    const playerId = player.id;
    const gameId = gameState.id;

    connection.invoke('StartTimer', playerId, gameId);
    setShowBtn(false); 
  };

  return (
    <>
      {player.isPartyLeader && showBtn ? (
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

export default StartButton;
