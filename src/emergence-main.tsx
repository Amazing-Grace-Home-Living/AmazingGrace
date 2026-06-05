import React from 'react';
import { createRoot } from 'react-dom/client';
import { EmergenceDataProvider } from './components/EmergenceSimulation/EmergenceDataContext';
import { EmergenceScene } from './components/EmergenceSimulation/EmergenceScene';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <React.StrictMode>
    <EmergenceDataProvider>
      <EmergenceScene />
    </EmergenceDataProvider>
  </React.StrictMode>
);
