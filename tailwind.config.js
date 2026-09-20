/** @type {import('tailwindcss').Config} */
module.exports = {
    blocklist: ["overline"],
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: { '2xl': '1400px' }
      },
      extend: {
        fontFamily: {
          display: ['Genty', 'Fraunces', 'ui-serif', 'serif'],
          sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        colors: {
          wonder: {
            bg: '#FCE7EE',
            blush: '#FBDCE7',
            rose: '#F6C9D8',
            panel: '#F8D5E0',
            pinklt: '#F4B8CB',
            pink: '#E098A8',
            pinkdeep: '#C04868',
            plum: '#7D2540',
            cream: '#FFF6F9',
            ink: '#3B1622',
            muted: '#9A6576',
            gold: '#C04868',
            goldlight: '#E098A8',
          },
          show: {
            bg: '#140306',
            panel: '#1e070b',
            red: '#E11D2A',
            reddeep: '#8E0E17',
            gold: '#F2C24B',
            cream: '#FCE9D0',
          },
          xmas: {
            bg: '#07130E',
            panel: '#0C2019',
            green: '#0E3B2E',
            gold: '#EBC474',
            red: '#C4462F',
            cream: '#F3EEDC',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
          secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
          destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
          muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
          accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
          popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
          card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
          chart: {
            '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))',
            '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))'
          },
          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        },
        keyframes: {
          'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
          'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
          shine: { '0%': { backgroundPosition: '200% center' }, '100%': { backgroundPosition: '-200% center' } },
          floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          shine: 'shine 6s linear infinite',
          floaty: 'floaty 6s ease-in-out infinite',
        }
      }
    },
    plugins: [require("tailwindcss-animate")],
  }
