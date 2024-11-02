import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EndPoint from '../EndPoint';
import { GameStateProvider } from '../Providers/GameState/GameStateProvider';

const GameRoutes = () => {
    return (
        <GameStateProvider>
            <Routes>
                <Route path={EndPoint.Paths.CreateGame} element={<EndPoint.Pages.CreateGame />} />
                <Route path={EndPoint.Paths.JoinGame} element={<EndPoint.Pages.JoinGame />} />
                <Route path={EndPoint.Paths.TypeRacer} element={<EndPoint.Pages.TypeRacer />} />
            </Routes>
        </GameStateProvider>
    );
};

export default GameRoutes;
