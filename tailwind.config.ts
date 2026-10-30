import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atlantica: {
          blue: "#004B93",
          night: "#041122",
          gold: "#D49B35",
          white: "#FFFFFF",
        },
        primary: "#004B93",
        background: "#041122",
        accent: "#D49B35",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3CA6E 0%, #D49B35 50%, #9E6D18 100%)",
        "atlantica-gradient": "linear-gradient(180deg, rgba(4,17,34,0.5) 0%, rgba(4,17,34,0.65) 50%, rgba(4,17,34,0.92) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px rgba(212, 155, 53, 0.45)",
        "blue-glow": "0 0 25px rgba(0, 75, 147, 0.5)",
        "ut-card": "0 0 25px rgba(0, 75, 147, 0.5), 0 10px 30px rgba(4, 17, 34, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
