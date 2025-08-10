/* eslint-disable no-undef */
module.exports = {
  build: {
    content: ["./src/templates/emails/**/*.html"],
    output: {
      path: "./src/templates/build_emails"
    },
    html: {
      minify: false
    }
  },
  css: {
    inline: {
      applyWidthAttributes: true
    },
    purge: false
  },
  tailwind: {
    config: "./tailwind.config.js"
  }
};
