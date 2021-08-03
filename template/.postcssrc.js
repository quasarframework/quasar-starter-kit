// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // to edit target browsers: use "browserslist" field in package.json
    require(require.resolve("autoprefixer", {
      paths: [require.resolve("@quasar/app/package.json")],
    })),
  ],
};
