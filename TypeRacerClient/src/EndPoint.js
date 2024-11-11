//Pages
import CreateGame from "./Pages/CreateGame/CreateGame";
import JoinGame from "./Pages/JoinGame/JoinGame";
import GameMenu from "./Pages/GameMenu/GameMenu";
import TypeRacer from "./Pages/TypeRacer/TypeRacer";
//Components
import SButton from "./Components/SButton";
import SInput from "./Components/SInput";
import SPowerUnit from "./Components/SPowerUnit";
//Panels
import CountDown from "./Panels/Countdown/CountDown";
import StartButton from "./Panels/StartButton/StartButton";
import WordDisplay from "./Panels/WordDisplay/WordDisplay";
import InputForm from "./Panels/InputForm/InputForm";
import GamePlayersPanel from "./Panels/GamePlayersPanel/GamePlayersPanel";
import PowerBoardPanel from "./Panels/PowerBoardPanel/PowerBoardPanel";
import GameLog from "./Panels/GameLog/GameLog";
//Explicit routes
import GameRoutes from "./ExplicitRoutes/GameRoutes";

const ApiIP = "https://localhost:7146/"

const EndPoint = {
  "ApiPaths":{
    Powers:() => `${ApiIP}api/game/powers`,
    WordStyles:() => `${ApiIP}api/game/wordStyles`,
    PlayerGameResults:() => `${ApiIP}api/game/playerGameResults`,
    PlayerPowers:(id) => `${ApiIP}api/game/player/${id}/powers`,
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
    SButton, SInput, SPowerUnit
  },
  "Panels": {
    InputForm, WordDisplay, StartButton, CountDown, GamePlayersPanel, PowerBoardPanel,GameLog
  }
};

export default EndPoint;