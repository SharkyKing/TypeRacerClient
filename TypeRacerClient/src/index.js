import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { SocketProvider } from './Providers/Socket/SocketProvider';
import { FunctionProvider } from './Providers/FunctionProvider/FunctionProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
      <SocketProvider>
        <FunctionProvider>
           <App />
        </FunctionProvider>
      </SocketProvider>
  </Router>
  
);