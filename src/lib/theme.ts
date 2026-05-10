export const THEMES = {
  blue: {
    primary: '#ff007f', // Neon Pink (Default)
    bg: '#050505',
    card: '#0c0c0c',
    text: '#ffffff',
    header: '#000000'
  },
  black: {
    primary: '#ff007f',
    bg: '#000000',
    card: '#0c0c0c',
    text: '#ffffff',
    header: '#000000'
  },
  pink: {
    primary: '#ff007f',
    bg: '#050505',
    card: '#111111',
    text: '#ffffff',
    header: '#000000'
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
