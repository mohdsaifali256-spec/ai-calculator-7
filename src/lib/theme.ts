export const THEMES = {
  blue: {
    primary: '#2563eb',
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    header: '#1e293b'
  },
  black: {
    primary: '#ffffff',
    bg: '#000000',
    card: '#111111',
    text: '#ffffff',
    header: '#000000'
  },
  red: {
    primary: '#ef4444',
    bg: '#450a0a',
    card: '#7f1d1d',
    text: '#fee2e2',
    header: '#7f1d1d'
  },
  green: {
    primary: '#22c55e',
    bg: '#052e16',
    card: '#064e3b',
    text: '#dcfce7',
    header: '#064e3b'
  },
  purple: {
    primary: '#a855f7',
    bg: '#2e1065',
    card: '#4c1d95',
    text: '#f3e8ff',
    header: '#4c1d95'
  },
  orange: {
    primary: '#f97316',
    bg: '#431407',
    card: '#7c2d12',
    text: '#ffedd5',
    header: '#7c2d12'
  },
  pink: {
    primary: '#ec4899',
    bg: '#500724',
    card: '#831843',
    text: '#fce7f3',
    header: '#831843'
  },
  yellow: {
    primary: '#eab308',
    bg: '#422006',
    card: '#713f12',
    text: '#fef9c3',
    header: '#713f12'
  },
  cyan: {
    primary: '#06b6d4',
    bg: '#083344',
    card: '#155e75',
    text: '#cffafe',
    header: '#155e75'
  },
  mix: {
    primary: '#3b82f6',
    bg: '#18181b',
    card: '#27272a',
    text: '#ffffff',
    header: '#000000'
  }
};

export type ThemeName = keyof typeof THEMES | 'custom';

export interface CustomTheme {
  primary: string;
  bg: string;
  card: string;
  text: string;
  header: string;
}

export function applyTheme(theme: CustomTheme) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-bg', theme.bg);
  root.style.setProperty('--color-card', theme.card);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-header', theme.header);
}

export function getSavedTheme(): { name: ThemeName, custom?: CustomTheme } {
  const saved = localStorage.getItem('app_theme');
  if (saved) {
    return JSON.parse(saved);
  }
  return { name: 'blue' };
}

export function saveTheme(name: ThemeName, custom?: CustomTheme) {
  localStorage.setItem('app_theme', JSON.stringify({ name, custom }));
}
