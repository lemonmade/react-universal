'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackConfigFactory;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _assetsWebpackPlugin = require('assets-webpack-plugin');

var _assetsWebpackPlugin2 = _interopRequireDefault(_assetsWebpackPlugin);

var _webpackNodeExternals = require('webpack-node-externals');

var _webpackNodeExternals2 = _interopRequireDefault(_webpackNodeExternals);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _postcssWillChange = require('postcss-will-change');

var _postcssWillChange2 = _interopRequireDefault(_postcssWillChange);

var _postcssDiscardComments = require('postcss-discard-comments');

var _postcssDiscardComments2 = _interopRequireDefault(_postcssDiscardComments);

var _postcssCalc = require('postcss-calc');

var _postcssCalc2 = _interopRequireDefault(_postcssCalc);

var _postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

var _postcssFlexbugsFixes2 = _interopRequireDefault(_postcssFlexbugsFixes);

var _postcssSelectorMatches = require('postcss-selector-matches');

var _postcssSelectorMatches2 = _interopRequireDefault(_postcssSelectorMatches);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-console, no-process-env */

function removeEmpty(x) {
  return x.filter(Boolean);
}

function ifElse(condition) {
  return function (then, or) {
    return condition ? then : or;
  };
}

function merge() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(removeEmpty(args))));
}

function webpackConfigFactory(_ref, _ref2) {
  var target = _ref.target;
  var mode = _ref.mode;
  var projectRoot = _ref2.projectRoot;
  var appDir = _ref2.appDir;
  var dataDir = _ref2.dataDir;
  var clientDevServerPort = _ref2.clientDevServerPort;

  if (['client', 'server'].find(function (valid) {
    return target === valid;
  }) == null) {
    throw new Error('You must provide a "target" (client|server) to the webpackConfigFactory.');
  }

  if (['development', 'production'].find(function (valid) {
    return mode === valid;
  }) == null) {
    throw new Error('You must provide a "mode" (development|production) to the webpackConfigFactory.');
  }

  var relayPluginPath = _path2.default.join(dataDir, 'babel-relay-plugin');

  var isDev = mode === 'development';
  var isProd = mode === 'production';
  var isClient = target === 'client';
  var isServer = target === 'server';

  var ifDev = ifElse(isDev);
  var ifProd = ifElse(isProd);
  var ifClient = ifElse(isClient);
  var ifServer = ifElse(isServer);
  var ifDevClient = ifElse(isDev && isClient);
  var ifDevServer = ifElse(isDev && isServer);
  var ifProdClient = ifElse(isProd && isClient);

  return {
    target: ifServer('node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true
    },
    externals: removeEmpty([ifServer((0, _webpackNodeExternals2.default)({
      // Add any dependencies here that need to be processed by Webpack
      binaryDirs: ['blueprint']
    }))]),
    devtool: ifElse(isServer || isDev)('source-map', 'hidden-source-map'),
    entry: merge({
      main: removeEmpty([ifDevClient('react-hot-loader/patch'), ifDevClient('webpack-hot-middleware/client?reload=true&path=http://localhost:' + clientDevServerPort + '/__webpack_hmr'), _path2.default.resolve(projectRoot, './' + target + '/index.js')])
    }),
    output: {
      path: _path2.default.resolve(projectRoot, './build/' + target),
      filename: ifProdClient('[name]-[hash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(
      // As we run a seperate server for our client and server bundles we
      // need to use an absolute http path for our assets public path.
      'http://localhost:' + clientDevServerPort + '/assets/', '/assets/'),
      libraryTarget: ifServer('commonjs2', 'var')
    },
    resolve: {
      modules: [appDir, 'node_modules'],
      // These extensions are tried when resolving a file.
      extensions: ['.js', '.jsx', '.json']
    },
    plugins: removeEmpty([new _webpack2.default.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode)
      }
    }),

    // Generates a JSON file containing a map of all the output files for
    // our webpack bundle.  A necessisty for our server rendering process
    // as we need to interogate these files in order to know what JS/CSS
    // we need to inject into our HTML.
    new _assetsWebpackPlugin2.default({
      filename: 'assets.json',
      path: _path2.default.resolve(projectRoot, './build/' + target)
    }), ifDev(new _webpack2.default.NoErrorsPlugin()), ifDevClient(new _webpack2.default.HotModuleReplacementPlugin()), ifDevServer(new _webpack2.default.optimize.LimitChunkCountPlugin({ maxChunks: 1 })), ifProdClient(new _webpack2.default.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })), ifProdClient(new _webpack2.default.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // eslint-disable-line camelcase
        warnings: false
      }
    })), ifProd(new _webpack2.default.optimize.DedupePlugin()), ifProdClient(new _extractTextWebpackPlugin2.default({ filename: '[name]-[chunkhash].css', allChunks: true }))]),
    module: {
      loaders: [{
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader'
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/, _path2.default.resolve(projectRoot, './build')],
        query: merge({
          env: {
            development: {
              presets: [{ plugins: [relayPluginPath] }],
              plugins: ['react-hot-loader/babel']
            }
          }
        }, ifServer({
          presets: [{ plugins: [relayPluginPath] }, 'stage-2', 'react'],
          plugins: ['transform-class-properties', 'transform-export-extensions']
        }), ifClient({
          // For our clients code we will need to transpile our JS into
          // ES5 code for wider browser/device compatability.
          presets: [{ plugins: [relayPluginPath] }, ['es2015', { modules: false }], 'stage-2', 'react'],
          plugins: ['transform-class-properties', 'transform-export-extensions']
        }))
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, merge({ test: /\.scss$/ }, ifServer({
        loaders: ['css-loader/locals?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]', 'sass-loader']
      }), ifProdClient({
        loader: _extractTextWebpackPlugin2.default.extract({
          notExtractLoader: 'style-loader',
          loader: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!sass-loader!postcss-loader'
        })
      }), ifDevClient({
        loaders: ['style-loader', {
          loader: 'css-loader',
          query: {
            sourceMap: true,
            modules: true,
            importLoaders: 1,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
          }
        }, {
          loader: 'sass-loader',
          query: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          query: { sourceMap: true }
        }]
      }))]
    },
    postcss: [(0, _postcssDiscardComments2.default)(), (0, _postcssCalc2.default)(), _postcssFlexbugsFixes2.default, _postcssSelectorMatches2.default, _postcssWillChange2.default, (0, _autoprefixer2.default)()],
    sassLoader: {
      includePaths: [appDir]
    }
  };
}