const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MinaWebpackPlugin = require("./plugin/MinaWebpackPlugin");
const MinaRuntimePlugin = require("./plugin/MinaRuntimePlugin");
const LodashWebpackPlugin = require("lodash-webpack-plugin");
const webpack = require("webpack");
const debuggable = process.env.BUILD_TYPE !== "release";

module.exports = {
  context: resolve("src"),
  entry: "./app.js",
  output: {
    path: resolve("dist"),
    filename: "[name].js",
    globalObject: "wx"
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "common",
      minChunks: 2,
      minSize: 0
    },
    usedExports: true,
    runtimeChunk: {
      name: "runtime"
    }
  },
  devtool: debuggable ? "inline-source-map" : "source-map",
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || "development",
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || "debug"
    }),

    new MinaWebpackPlugin({
      scriptExtensions: [".js"],
      assetExtensions: [".scss"]
    }),
    new LodashWebpackPlugin(),
    new MinaRuntimePlugin(),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new CopyWebpackPlugin([
      {
        from: "**/*",
        to: "./",
        ignore: ["**/*.js", "**/*.scss"]
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /\.(scss)$/,
        include: /src/,
        use: [
          {
            loader: "file-loader",
            options: {
              useRelativePath: true,
              name: "[path][name].wxss",
              context: resolve("src")
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: [resolve("src", "styles"), resolve("src")]
            }
          }
        ]
      }
    ]
  },
  mode: debuggable ? "none" : "production"
};
