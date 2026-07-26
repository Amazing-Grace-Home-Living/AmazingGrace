import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import VirtueMatchApp from './VirtueMatchApp';

const rootEl = document.getElementById('virtue-match-root');
if (rootEl) {
    createRoot(rootEl).render(
        <StrictMode>
            <VirtueMatchApp />
        </StrictMode>
    );
} else {
    console.error('Failed to find #virtue-match-root');
}
