import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'chat-background': "url('/chat-bg.png')",
      },
      colors: {
        secondary: '#8696a0',
        'red-500': '#ef4444',
        white: '#ffffff',
        'teal-light': '#7ae3c3',
        'photopicker-overlay-background': 'rgba(30,42,49,0.8)',
        'dropdown-background': '#233138',
        'dropdown-background-hover': '#182229',
        'input-background': ' #2a3942',
        'primary-strong': '#e9edef',
        'panel-header-background': '#202c33',
        'panel-header-icon': '#aebac1',
        'icon-lighter': '#8696a0',
        'icon-green': '#00a884',
        'search-input-container-background': '#111b21',
        'conversation-border': 'rgba(134,150,160,0.15)',
        'conversation-panel-background': '#0b141a',
        'background-default-hover': '#202c33',
        'incoming-background': '#202c33',
        'outgoing-background': '#005c4b',
        'bubble-meta': 'hsla(0,0%,100%,0.6)',
        'icon-ack': '#53bdeb',
      },
      gridTemplateColumns: {
        main: '1fr 2.4fr',
      },
    },
    fontFamily: {
      eurostile: ['Eurostile', 'sans-serif'],
    },
  },
  plugins: [],
};
export default config;
