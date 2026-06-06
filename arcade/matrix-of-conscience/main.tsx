import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MatrixOfConscience, { ConscienceProvider } from '../../src/arcade/matrix-of-conscience/MatrixOfConscience';

const root = document.getElementById('emergence-root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ConscienceProvider>
        <MatrixOfConscience activeUser="nicholai_madias" />
      </ConscienceProvider>
    </StrictMode>
  );
} else {
  throw new Error('Root container #emergence-root for Matrix of Conscience was not found.');
}
