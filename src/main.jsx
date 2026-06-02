import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SevenSistersProvider } from './context/SevenSistersContext';
import { FamilyStatsProvider } from './context/FamilyStatsContext';
import { DualAscentProvider } from './dual-ascent/DualAscentContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FamilyStatsProvider>
      <DualAscentProvider>
      <SevenSistersProvider>
      <App />
    </SevenSistersProvider>
    </DualAscentProvider>
    </FamilyStatsProvider>
  </React.StrictMode>
);


