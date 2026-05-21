import React from 'react';
import { createRoot } from 'react-dom/client';
import QuickClickApp from './QuickClickApp';
import { bootstrapArcadeModule } from '../../../arcade/js/nexus-connector.js';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

bootstrapArcadeModule({
  moduleId: 'QUICK_CLICK',
  title: 'Quick Click',
  href: './',
  description: 'Reflex challenge process connected to the Nexus arcade state.',
});

createRoot(container).render(
  <React.StrictMode>
    <QuickClickApp />
  </React.StrictMode>
);
