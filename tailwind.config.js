module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: {
    content: ["src/**/*.vue"],
    options: {
      whitelist: ["tw-*"],
    },
  },
  darkMode: false, // or 'media' or 'class'
  prefix: "tw-",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
