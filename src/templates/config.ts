const TAILWIND_CONFIG = () => {
  return {
    fileName: "tailwind.config.js",
    path: "",
    contents: `
      /** @type {import('tailwindcss').Config} */
      module.exports = {
        content: [
          "./app/**/*.{js,ts,jsx,tsx}",
          "./pages/**/*.{js,ts,jsx,tsx}",
          "./components/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {},
        },
        plugins: [],
       };
      `,
  };
};

const GLOBAL_STYLES = () => {
  return {
    fileName: "globals.css",
    path: "styles",
    contents: `
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }
  
      a {
        color: inherit;
        text-decoration: none;
      }
  
      * {
        box-sizing: border-box;
      }
  
      @media (prefers-color-scheme: dark) {
        html {
          color-scheme: dark;
        }
        body {
          color: white;
          background: black;
        }
      }
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      `,
  };
};

export { TAILWIND_CONFIG, GLOBAL_STYLES };
