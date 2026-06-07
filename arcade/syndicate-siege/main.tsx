import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SyndicateSiegeApp from './SyndicateSiegeApp';

const rootElement = document.getElementById('syndicate-siege-root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SyndicateSiegeApp />
    </StrictMode>
  );
} else {
  console.error("Failed to find #syndicate-siege-root");
}
