import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MatrixOfConscience, { ConscienceProvider } from '../src/components/MatrixOfConscience';

const root = document.getElementById('matrix-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ConscienceProvider>
        <MatrixOfConscience />
      </ConscienceProvider>
    </StrictMode>
  );
} else {
  throw new Error('Root container #matrix-root was not found.');
}
