import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MatrixOfConscience from '../../src/components/MatrixOfConscience';
import { ConscienceProvider } from '../../src/components/ConscienceProvider';

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
