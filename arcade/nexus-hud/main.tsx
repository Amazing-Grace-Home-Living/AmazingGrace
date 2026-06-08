import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import NexusHUD from '../../src/arcade/nexus-hud/NexusHUD';

const rootElement = document.getElementById('nexus-hud-root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <NexusHUD />
    </StrictMode>
  );
} else {
  console.error("Failed to find #nexus-hud-root");
}
