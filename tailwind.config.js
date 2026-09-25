/** @type {import('tailwindcss').Config} */
import { tailwindExtend } from '@updesh/design-tokens';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: tailwindExtend,
  },
  plugins: [],
};
