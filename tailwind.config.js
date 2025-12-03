/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#09090f",      // true black
        secondary: "#181825",    // deep dark gray
        surface: "#23232b",      // card backgrounds, slightly lighter
        accent: "#00ffc6",       // neon electric blue/green
        accent2: "#7c3aed",      // neon magenta (purple)
        accent3: "#d4ff37",      // neon lime
        text: "#f3f4f6",         // light text
        muted: "#8a8fa3",        // muted text
      },
    },
  },
  plugins: [],
}

