/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "#ddc39a",
            h1: {
              color: "#ddc39a",
              marginTop: "1.5rem",
              marginBottom: "1rem",
            },
            h2: {
              color: "#ddc39a",
              marginTop: "1.5rem",
              marginBottom: "1rem",
            },
            h3: {
              color: "#ddc39a",
              marginTop: "1.25rem",
              marginBottom: "0.75rem",
            },
            p: {
              marginTop: "0.75rem",
              marginBottom: "0.75rem",
            },
            li: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },
            ul: {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            ol: {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            strong: {
              color: "#ddc39a",
              fontWeight: "600",
            },
            blockquote: {
              color: "#ddc39a",
              borderLeftColor: "#ddc39a",
            },
            code: {
              color: "#ddc39a",
              backgroundColor: "rgba(221, 195, 154, 0.1)",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
            },
          },
        },
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateX(-50%) translateY(-10px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(-50%) translateY(0)",
          },
        },
        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideUp: "slideUp 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
        xl: "20px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  corePlugins: {
    preflight: true,
  },
};
