const colors = require("tailwindcss/colors");

module.exports = {
    purge: ["./index.html", "./src/**/*{css,js,vue,ts}"],
    darkMode: false,
    theme: {
        extend: {
            colors: {
                gray: colors.trueGray,
                blurple: {
                    DEFAULT: "#7289DA",
                    50: "#FFFFFF",
                    100: "#FFFFFF",
                    200: "#EBEEFA",
                    300: "#C3CDEF",
                    400: "#9AABE5",
                    500: "#7289DA",
                    600: "#4A67CF",
                    700: "#304EB6",
                    800: "#253C8E",
                    900: "#1B2B65",
                },
            },
            fontFamily: {
                sans: "Roboto, sans-serif",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
