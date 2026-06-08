import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EmergenceDataProvider } from '../../src/components/EmergenceSimulation/EmergenceDataContext';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <EmergenceDataProvider>
                <App />
            </EmergenceDataProvider>
        </React.StrictMode>
    );
}
