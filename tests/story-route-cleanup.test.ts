import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('story and arcade cleanup', () => {
  it('removes Matrix act placeholder routes from active entry points', () => {
    const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
    const arcade = fs.readFileSync('arcade/index.html', 'utf8');
    const serviceWorker = fs.readFileSync('public/sw.js', 'utf8');

    expect(viteConfig).not.toContain('matrix-act-1');
    expect(viteConfig).not.toContain('matrix-act-2');
    expect(arcade).not.toContain('matrix-act-1');
    expect(arcade).not.toContain('Matrix Act 1');
    expect(serviceWorker).not.toContain('matrix-act-1');
    expect(serviceWorker).not.toContain('matrix-act-2');
  });

  it('uses content-based story routes instead of generic storybook names', () => {
    const library = fs.readFileSync('stories/library.json', 'utf8');
    const matrixApp = fs.readFileSync('src/MatrixApp.jsx', 'utf8');
    const lampStory = fs.readFileSync('stories/books/the-lamp-in-the-window.html', 'utf8');
    const exposeStory = fs.readFileSync('stories/expose-the-matrix/index.html', 'utf8');

    expect(library).not.toContain('storybook-1');
    expect(library).not.toContain('storybook-2');
    expect(library).toContain('/stories/books/the-lamp-in-the-window.html');
    expect(library).toContain('/stories/noah-and-the-ark/');
    expect(matrixApp).toContain('/stories/books/the-lamp-in-the-window.html');
    expect(lampStory).not.toContain('storybook-2');
    expect(exposeStory).not.toContain('storybook-2');
  });
});
