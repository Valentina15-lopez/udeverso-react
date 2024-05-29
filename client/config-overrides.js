const path = require("path");

module.exports = function override(config, env) {
  // Agrega el alias para importar pdfjs-dist
  config.resolve.alias = {
    ...config.resolve.alias,
    "pdfjs-dist": path.resolve(
      __dirname,
      "node_modules/pdfjs-dist/legacy/build/pdf.mjs"
    ),
  };

  // Permitir la importación de pdf.worker
  config.module.rules.push({
    test: /pdf\.worker\.(min\.)?js/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  });

  return config;
};
