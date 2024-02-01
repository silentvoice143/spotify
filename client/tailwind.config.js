/** @type {import('tailwindcss').Config} */

export default {
  // content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotifybg: "#202020",
        lightgray: "#313131",
        darkgray: "#121212",
        primarybg: "#121212",
        primarytext: "#b3b3b3",
        spotify_green: "#1db954",
        song_pink: "#d696bb",
        song_orange: "#b96332",
        song_brown: "#854442",
        song_sky: "#8caba8",
        song_mate: "#4f5b66",
        song_yello: "#f6cd61",
      },
      backgroundImage: {
        "white-gradient":
          "linear-gradient(180deg, rgba(130,130,130,1) 0%, rgba(96,96,96,1) 33%, rgba(37,37,37,1) 100%)",
        "green-gradient":
          "linear-gradient(180deg, rgba(110,255,35,1) 0%, rgba(99,221,46,1) 33%, rgba(92,147,72,1) 100%)",
        "pink-gradient":
          "linear-gradient(180deg, rgba(252,35,255,1) 0%, rgba(207,46,221,1) 33%, rgba(142,72,147,1) 100%)",
        "orange-gradient":
          "linear-gradient(180deg, rgba(255,193,35,1) 0%, rgba(221,178,46,1) 33%, rgba(147,126,72,1) 100%)",
        "red-gradient":
          "linear-gradient(180deg, rgba(255,37,37,1) 0%, rgba(221,46,46,1) 33%, rgba(147,72,72,1) 100%)",
        "yellow-gradient":
          "linear-gradient(180deg, rgba(255,245,35,1) 0%, rgba(221,219,46,1) 33%, rgba(147,145,72,1) 100%)",
        "sky-gradient":
          "linear-gradient(180deg, rgba(37,254,255,1) 0%, rgba(46,220,221,1) 33%, rgba(72,147,147,1) 100%)",
        "list-gradient":
          "linear-gradient(180deg, rgba(91,91,91,1) 0%, rgba(67,67,67,1) 16%, rgba(18,18,18,1) 100%)",
        // Add more custom gradients as needed
      },
      boxShadow: {
        "primary-shadow": "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      },
      height: {
        "1/9": "13%",
        "8/9": "87%",
      },
      fontFamily: {
        robo: "Roboto",
        mont: "Montserrat",
        opensans: "OpenSans",
        spotify: "VarelaRound",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
