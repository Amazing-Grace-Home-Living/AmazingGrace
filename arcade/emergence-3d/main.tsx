import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmergenceDataProvider } from '../../src/components/EmergenceSimulation/EmergenceDataContext';
import { EmergenceScene } from '../../src/components/EmergenceSimulation/EmergenceScene';

const root = document.getElementById('emergence-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <EmergenceDataProvider>
        <EmergenceScene />
      </EmergenceDataProvider>
    </StrictMode>
  );
}
