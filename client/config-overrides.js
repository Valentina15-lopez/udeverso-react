const path = require("path");

// Agrega el alias para importar pdfjs-dis
module.exports = {
  webpack: function (config) {
    config = {
      resolve: {
        ...config.resolve,
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
          "pdfjs-dist": path.resolve(
            "./node_modules/pdfjs-dist/legacy/build/pdf.js"
          ),
        },
      },
    };
    return config;
  },
};
