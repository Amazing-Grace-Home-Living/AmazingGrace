import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmergenceDataProvider } from '../../src/components/EmergenceSimulation/EmergenceDataContext';
import { EmergenceScene } from '../../src/components/EmergenceSimulation/EmergenceScene';
import { ConscienceProvider } from '../../src/components/ConscienceProvider';

const root = document.getElementById('emergence-root');

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
  throw new Error('Root container #emergence-root for Matrix of Conscience (3D) was not found.');
}
