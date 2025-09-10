/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add these lines for Flowbite
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ["Poppins", "sans-serif"],
      // },
      screens: {
        sm: { min: "335px", max: "780px" },
        md: { min: "760px", max: "1019px" },
        lg: { min: "1000px", max: "2000px" },
      },
    },
  },
  plugins: [
    require("flowbite/plugin"), // Add Flowbite plugin
  ],
};
