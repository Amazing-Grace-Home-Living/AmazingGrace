import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SevenSistersProvider } from './context/SevenSistersContext';
import { FamilyStatsProvider } from './context/FamilyStatsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FamilyStatsProvider>
      <SevenSistersProvider>
      <App />
    </SevenSistersProvider>
    </FamilyStatsProvider>
  </React.StrictMode>
);

