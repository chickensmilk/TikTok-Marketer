/**
 * Digital Resource (DR) — Tailwind CSS Brand Config
 *
 * Extend your tailwind.config.js with this preset:
 *
 *   const drBrand = require('./tailwind.brand.js')
 *   module.exports = {
 *     presets: [drBrand],
 *     // your config...
 *   }
 *
 * Or spread the theme:
 *   theme: { extend: { ...drBrand.theme.extend } }
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        dr: {
          navy:      '#010F37',
          orange:    '#F6931E',
          blue:      '#26A9E1',
          lime:      '#D5DE23',
          'lime-dark': '#C3CB1D',
          'gray-dark': '#404041',
          'gray-line': '#D1D3D4',
          'gray-icon': '#E5E5E5',
          white:     '#FFFFFF',
          black:     '#000000',
        },
      },

      fontFamily: {
        dr: ['"Inter Tight"', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'dr-display': ['clamp(3rem, 6vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'dr-h1':      ['clamp(2.5rem, 4vw, 3rem)',  { lineHeight: '1.1', fontWeight: '700' }],
        'dr-h2':      ['clamp(2rem, 3vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'dr-h3':      ['clamp(1.5rem, 2vw, 1.75rem)', { lineHeight: '1.25', fontWeight: '600' }],
        'dr-h4':      ['clamp(1.25rem, 1.5vw, 1.375rem)', { lineHeight: '1.3', fontWeight: '600' }],
      },

      borderRadius: {
        'dr-sm':   '0.375rem',
        'dr-md':   '0.75rem',
        'dr-lg':   '1rem',
        'dr-xl':   '1.5rem',
        'dr-2xl':  '2rem',
      },

      boxShadow: {
        // DR uses flat (offset) shadows only
        'dr-flat-sm': '2px 2px 0 #010F37',
        'dr-flat-md': '4px 4px 0 #010F37',
        'dr-flat-lg': '6px 6px 0 #010F37',
        'dr-flat-lime': '4px 4px 0 #D5DE23',
        'dr-flat-orange': '4px 4px 0 #F6931E',
      },

      backgroundImage: {
        // Vibrant gradient: always Blue → Green → Orange
        'dr-vibrant': 'linear-gradient(90deg, #26A9E1, #D5DE23, #F6931E)',
        'dr-navy':    'linear-gradient(135deg, #010F37 0%, #0a1f5c 100%)',
        'dr-blue-green': 'linear-gradient(90deg, #26A9E1, #D5DE23)',
      },

      spacing: {
        // No changes needed — use default Tailwind spacing scale
        // DR uses standard 4px base grid
      },

      animation: {
        'dr-fade-in': 'drFadeIn 0.4s ease forwards',
        'dr-slide-up': 'drSlideUp 0.4s ease forwards',
      },

      keyframes: {
        drFadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
