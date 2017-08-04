var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/Glocation.ts",
    output: {
        path: __dirname + "/dist/tmp",
        filename: "src/widget/Glocation.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js", ".json" ], // TODO remove .js and .json...supported by default
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({ // not required since there is no css
                fallback: "style-loader",
                use: "css-loader"
            }) }
        ]
    },
    devtool: "source-map",
    externals: [ /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },// js can be removed
            { from: "src/**/*.xml" }
        ], {
            copyUnmodified: true
        }),
        //new ExtractTextPlugin("./src/org/flockofbirds/widget/cropimage/ui/CropImage.css"),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};
