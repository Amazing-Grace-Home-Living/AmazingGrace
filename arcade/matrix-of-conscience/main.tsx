import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmergenceDataProvider } from '../../src/components/EmergenceSimulation/EmergenceDataContext';
import { EmergenceScene } from '../../src/components/EmergenceSimulation/EmergenceScene';
import { ConscienceProvider } from '../../src/components/ConscienceProvider';

// Standalone root entry point for Matrix of Conscience (3D)
const rootElement = document.getElementById('emergence-root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ConscienceProvider>
          <EmergenceDataProvider>
            <EmergenceScene />
          </EmergenceDataProvider>
        </ConscienceProvider>
      </StrictMode>
    );
  } catch (err) {
    console.error('Failed to render Matrix of Conscience:', err);
    rootElement.innerHTML = `<div style="padding: 20px; color: #ff0055; font-family: monospace;">
      <h2>FATAL_ERROR: Matrix Mount Failed</h2>
      <pre>${err instanceof Error ? err.message : String(err)}</pre>
    </div>`;
  }
} else {
  document.body.innerHTML = `<div style="padding: 20px; color: #ff0055; font-family: monospace;">
    <h2>FATAL_ERROR: Root container #emergence-root not found.</h2>
  </div>`;
}

window.addEventListener('error', (event) => {
  console.error('Global JS Error:', event.error);
});
