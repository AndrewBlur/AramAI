import twAnimate from 'tw-animate';
import plugin from 'tailwindcss/plugin';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
  ],
  darkMode: 'class', // enable dark mode via .dark class
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        cardForeground: 'var(--card-foreground)',
        popover: 'var(--popover)',
        popoverForeground: 'var(--popover-foreground)',
        primary: 'var(--primary)',
        primaryForeground: 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        secondaryForeground: 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        mutedForeground: 'var(--muted-foreground)',
        accent: 'var(--accent)',
        accentForeground: 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        emerald: 'var(--clr-emerald-main)',
        success: 'var(--clr-success)',
        successForeground: 'var(--clr-success-foreground)',
        warning: 'var(--clr-warning)',
        warningForeground: 'var(--clr-warning-foreground)',
        info: 'var(--clr-info)',
        infoForeground: 'var(--clr-info-foreground)',
        neutral: 'var(--clr-neutral)',
        neutralForeground: 'var(--clr-neutral-foreground)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      backgroundImage: {
        'gradient-header': 'var(--gradient-header)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-brand': 'var(--gradient-brand)',
        'gradient-heading': 'var(--gradient-heading)',
      },
    },
  },
  plugins: [
    twAnimate,
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-linear": (value) => ({
            backgroundImage: `linear-gradient(${value})`,
          }),
        },
        { values: theme("gradientColorStops") }
      );
    }),
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient-onboarding-dark': {
          background: 'linear-gradient(to bottom, #ffffff, #686161)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
        },
        '.text-gradient-onboarding-light': {
          background: 'linear-gradient(to bottom, #313131, #D3D3D3)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          color: 'transparent',
        },
        '.text-gradient-green-subehading': {
          '@apply bg-gradient-to-r from-[#10B981] to-[#338066] bg-clip-text text-transparent': {},
        },
        '.chat-header': {
          background: 'var(--gradient-header)',
        },
        '.text-primary': {
          color: 'var(--clr-text-inverse)',
        },
      });
    },
  ],
};
