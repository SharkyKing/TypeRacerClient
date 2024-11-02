import React from "react";
import { Route, Routes } from 'react-router-dom';
import EndPoint from "./EndPoint";
import './app.css'

function App() {
  return (
      <React.Fragment>
          <div className="navbar">
             <img src="/images/typing.png" alt="TypeRaceEnchanted" />
             <h1>TYPE RACER - ENCAHNTED!</h1>
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
