import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './node_modules/flowbite/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      spacing: {
        108: '30rem'
      },
      colors: {
        lightBlue: {
          500: '#8fadc7'
        },
        blue: {
          500: '#004c97'
        },
        gray: {
          300: '#F3F4F8'
        }
      },
      height: {
        76: '19rem',
        88: '22rem',
        400: '400px',
        200: '200px'
      },
      width: {
        100: '600px'
      },
      gridTemplateColumns: {
        card: '1fr max-content'
      },
      screens: {
        xl: '1400px',
        '2xl': '1600px',
        '3xl': '1920px'
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      scale: ['active'],
      margin: ['responsive', 'hover', 'last', 'first'],
      translate: ['last', 'first'],
      justifySelf: ['last', 'first']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
