const path = require("path");

module.exports = {
    devServer: {
        host: 'localhost'
    },
    outputDir: path.resolve(__dirname, "../test-app/www/"),
    assetsDir: "static",
    publicPath:'./'
}
