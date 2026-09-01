import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './SevenStarsApp';

const rootEl = document.getElementById('seven-stars-root');
if (rootEl) {
    createRoot(rootEl).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
} else {
    console.error('Failed to find #seven-stars-root');
}
