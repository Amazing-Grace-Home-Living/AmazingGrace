/**
 * Progress-Based Theme Engine
 */
export function applyThemeByProgress(level) {
  let theme;

  if (level < 10) theme = 'beginner';
  else if (level < 25) theme = 'adept';
  else if (level < 50) theme = 'master';
  else theme = 'ascended';

  // Ensures the theme stays consistent with the data-theme attribute in nexus-neon-fx.css
  document.body.dataset.theme = theme;
}
