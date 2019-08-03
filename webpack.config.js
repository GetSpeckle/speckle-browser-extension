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
const pkgJson = require('./package.json');

module.exports = {
  entry: {
    background: path.join(sourceRootPath, 'ts', 'background', 'index.ts'),
    options: path.join(sourceRootPath, 'ts', 'options', 'index.tsx'),
    popup: path.join(sourceRootPath, 'ts', 'popup', 'index.tsx'),
    speckle: path.join(sourceRootPath, 'ts', 'page', 'index.ts'),
    content: path.join(sourceRootPath, 'ts', 'content', 'index.tsx')
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
      {test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'}
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'options.html'),
      inject: 'body',
      filename: 'options.html',
      title: 'Speckle- Options Page',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourceRootPath, 'html', 'popup.html'),
      inject: 'body',
      filename: 'popup.html',
      title: 'Speckle - Popup Page',
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
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        WEB_BROWSER: JSON.stringify(webBrowser),
        PKG_NAME: JSON.stringify(pkgJson.name),
        PKG_VERSION: JSON.stringify(pkgJson.version),
      }
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
        contentScript: ['content'],
      }
    })
  );
}

if (nodeEnv === 'production') {
  module.exports.plugins.push(new CleanWebpackPlugin({outputPath: distRootPath, verbose: true, dry: false}));
}
