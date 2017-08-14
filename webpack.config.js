var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/Geolocation.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/widget/Geolocation.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts" ], 
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
        ]
    },
    devtool: "source-map",
    externals: [ /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" }
        ], {
            copyUnmodified: true
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
