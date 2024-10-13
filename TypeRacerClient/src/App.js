import React, {useEffect, useState} from "react";
import { Route, Routes } from 'react-router-dom';
import GameMenu from "./components/GameMenus";
import { useSocket } from "./SocketProvider";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import TypeRacer from "./components/TypeRacer";
import {useNavigate } from 'react-router-dom'
import './app.css'

function App() {
  const {connection} = useSocket();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({id:"", isOpen:false, players:[], words:[]})

  useEffect(() => {
        const handleGameUpdate = (game) => {
            console.log("Game updated:", game);
            setGameState(game);
        };

        if (connection) {
            console.log("Setting up update game event");
            connection.on('UpdateGame', handleGameUpdate);
        }

        return () => {
            if (connection) {
                connection.off('UpdateGame', handleGameUpdate);
            }
        };
    }, [connection]);

  useEffect(() => {
      if (gameState.id !== "") {
          navigate(`/game/${gameState.id}`);
      } else {
          console.log('Active game not found');
          navigate(`/`);
      }
  }, [gameState.id]);

  return (
      <React.Fragment>
          <div className="navbar">
             <img src="/images/typing.png" alt="TypeRaceEnchanted" />
             <h1>TYPE RACER - ENCAHNTED!</h1>
          </div>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<GameMenu/>}/>
              <Route path="/game/create" element={<CreateGame/>}/>
              <Route path="/game/join" element={<JoinGame/>}/>
              <Route path="/game/:gameID" element={<TypeRacer gameState={gameState}/>}/>
            </Routes>
          </div>
      </React.Fragment>
  );
}

export default App;
