import React from 'react';
import { createRoot } from 'react-dom/client';
import AtariLab from './AtariLab';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <React.StrictMode>
    <AtariLab />
  </React.StrictMode>
);
