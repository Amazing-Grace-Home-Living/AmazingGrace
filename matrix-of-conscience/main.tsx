import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MatrixOfConscience from '../src/components/MatrixOfConscience';
import { ConscienceProvider } from '../src/components/ConscienceProvider';

// Standalone root entry point for matrix.amazinggracehl.org
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
