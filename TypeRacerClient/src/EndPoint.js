//Pages
import CreateGame from "./Pages/CreateGame/CreateGame";
import JoinGame from "./Pages/JoinGame/JoinGame";
import GameMenu from "./Pages/GameMenu/GameMenu";
import TypeRacer from "./Pages/TypeRacer/TypeRacer";
//Components
import SButton from "./Components/SButton";
import SInput from "./Components/SInput";
//Panels
import CountDown from "./Panels/Countdown/CountDown";
import StartButton from "./Panels/StartButton/StartButton";
import WordDisplay from "./Panels/WordDisplay/WordDisplay";
import InputForm from "./Panels/InputForm/InputForm";
import GamePlayersPanel from "./Panels/GamePlayersPanel/GamePlayersPanel";
import PowerBoardPanel from "./Panels/PowerBoardPanel/PowerBoardPanel";
//Explicit routes
import GameRoutes from "./ExplicitRoutes/GameRoutes";

const ApiIP = "https://localhost:7146/"

const EndPoint = {
  "ApiPaths":{
    Powers:() => `${ApiIP}api/game/powers`,
    GameTypes:() => `${ApiIP}api/game/types`,
    GameLevels:() => `${ApiIP}api/game/levels`
  },
  "ExplicitRoutes":{
    GameRoutes
  },
  "Paths":{
    CreateGame: "/game/create", 
    JoinGame: "/game/join", 
    GameMenu: "/", 
    TypeRacer: "/game/:gameID",
    TypeRacerById:(id) => `/game/${id}`,
  },
  "Pages":{
    CreateGame, JoinGame, GameMenu, TypeRacer
  },
  "Components":{
    SButton, SInput
  },
  "Panels": {
    InputForm, WordDisplay, StartButton, CountDown, GamePlayersPanel, PowerBoardPanel
  }
};

export default EndPoint;