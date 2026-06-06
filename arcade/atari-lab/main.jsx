import React from 'react';
import { createRoot } from 'react-dom/client';
import AtariLab from '../../src/arcade/atari-lab/AtariLab';
import { ConscienceProvider } from '../../src/components/ConscienceProvider';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <React.StrictMode>
    <ConscienceProvider>
      <AtariLab />
    </ConscienceProvider>
  </React.StrictMode>
);
