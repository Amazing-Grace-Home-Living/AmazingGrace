import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmergenceDataProvider } from '../src/components/EmergenceSimulation/EmergenceDataContext';
import { EmergenceScene } from '../src/components/EmergenceSimulation/EmergenceScene';
import { ConscienceProvider } from '../src/components/ConscienceProvider';

// Standalone root entry point for matrix.amazinggracehl.org
const root = document.getElementById('matrix-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ConscienceProvider>
        <EmergenceDataProvider>
          <EmergenceScene />
        </EmergenceDataProvider>
      </ConscienceProvider>
    </StrictMode>
  );
} else {
  throw new Error('Root container #matrix-root was not found.');
}
