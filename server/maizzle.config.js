/* eslint-disable no-undef */
module.exports = {
  build: {
    content: ["./src/templates/emails/**/*.html"],
    output: {
      path: "./src/templates/build_emails"
    }
  },
  tailwind: {
    config: "./tailwind.config.js"
  }
};
