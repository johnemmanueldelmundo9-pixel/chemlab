const KEY = 'chemlab:theme';
const BAR = { light: '#fbfaf6', dark: '#0a121c' };

export function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.getElementById('theme-color');
  if (meta) meta.content = BAR[theme] || BAR.light;
  try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
}

export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
