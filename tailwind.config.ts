import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          bg: '#080808',
          s1: '#111111',
          s2: '#1A1A1A',
          s3: '#222222',
          gold: '#FAC51C',
          gold2: '#E8B218',
          txt: '#F5F5F5',
          txt2: '#A0A0A0',
          txt3: '#606060',
          green: '#2ECC71',
          red: '#E74C3C',
          orange: '#F39C12',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        },
      },
      backgroundColor: {
        'apex-bdr': 'rgba(255,255,255,0.06)',
        'apex-bdr2': 'rgba(250,197,28,0.2)',
        'gold-light': 'rgba(250,197,28,0.12)',
        'gold-lighter': 'rgba(250,197,28,0.06)',
      },
      borderColor: {
        'apex-bdr': 'rgba(255,255,255,0.06)',
        'apex-bdr2': 'rgba(250,197,28,0.2)',
      },
    },
  },
  plugins: [],
}
export default config
