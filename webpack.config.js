const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const {CheckerPlugin} = require('awesome-typescript-loader');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const sourceRootPath = path.join(__dirname, 'src');
const distRootPath = path.join(__dirname, 'dist');
const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const webBrowser = process.env.WEB_BROWSER ? process.env.WEB_BROWSER : 'chrome';

module.exports = {
  entry: {
    background: path.join(sourceRootPath, 'ts', 'background', 'index.ts'),
    options: path.join(sourceRootPath, 'ts', 'options', 'index.tsx'),
    popup: path.join(sourceRootPath, 'ts', 'popup', 'index.tsx'),
    // Content Scripts
    extension: path.join(sourceRootPath, 'ts', 'contentScripts', 'extension', 'index.tsx'),
  },
  output: {
    path: distRootPath,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {test: /\.(js|ts|tsx)?$/, loader: "awesome-typescript-loader", exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader', 'resolve-url-loader']},
      {test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,loader: 'url-loader?limit=100000'}
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'options.html'),
      inject: 'body',
      filename: 'options.html',
      title: 'Web Extension Starter - Options Page',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'popup.html'),
      inject: 'body',
      filename: 'popup.html',
      title: 'Web Extension Starter - Popup Page',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(sourceRootPath, 'assets'),
        to: path.join(distRootPath, 'assets'),
        test: /\.(jpg|jpeg|png|gif|svg)?$/,
      },
      {
        from: path.join(sourceRootPath, 'manifest.json'),
        to: path.join(distRootPath, 'manifest.json'),
        toType: 'file',
      },
      {
        from: path.join(sourceRootPath, '_locales'),
        to: path.join(distRootPath, '_locales'),
      }
    ]),
    new webpack.DefinePlugin({
      'NODE_ENV': JSON.stringify(nodeEnv),
      'WEB_BROWSER': JSON.stringify(webBrowser),
    }),
  ],
}

if (nodeEnv === 'watch') {
  module.exports.watch = true;
  module.exports.plugins.push(
    new ChromeExtensionReloader({
      port: 9128,
      reloadPage: true,
      entries: {
        background: 'background',
        options: 'options',
        popup: 'popup',
        contentScript: ['extension'],
      }
    })
  );
}

if (nodeEnv === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin(distRootPath, {verbose: true, dry: false}));
}
