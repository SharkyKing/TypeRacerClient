import React from "react";
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import EndPoint from "./EndPoint";
import './app.css'

function App() {
  const navigate = useNavigate();

  return (
      <React.Fragment>
          <div className="navbar">
             <img src="/images/typing.png" alt="TypeRaceEnchanted" onClick={() => {navigate(EndPoint.Paths.GameMenu)}}/>
             <h1>TYPE RACER - ENCHANTED!</h1>
          </div>
          <div className="main-content">
            <Routes>
                <Route path={EndPoint.Paths.GameMenu} element={<EndPoint.Pages.GameMenu/>}/>
                <Route path="/*" element={<EndPoint.ExplicitRoutes.GameRoutes />} />
            </Routes>
          </div>
      </React.Fragment>
  );
}

export default App;
