/* eslint-disable no-console, no-process-env */

import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import autoprefixer from 'autoprefixer';
import postcssWillChange from 'postcss-will-change';
import postcssDiscardComments from 'postcss-discard-comments';
import postcssCalc from 'postcss-calc';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssSelectorMatches from 'postcss-selector-matches';

function removeEmpty<T>(x: Array<?T>): Array<T> {
  return x.filter(Boolean);
}

function ifElse(condition: boolean): <T>(then: ?T, or: ?T) => ?T {
  return (then, or) => (condition ? then : or);
}

function merge(...args: Array<?Object>): Object {
  return Object.assign({}, ...removeEmpty(args));
}

export default function webpackConfigFactory({target, mode}, {projectRoot, appDir, dataDir, clientDevServerPort, buildDir}) {
  if (['client', 'server'].find((valid) => target === valid) == null) {
    throw new Error('You must provide a "target" (client|server) to the webpackConfigFactory.');
  }

  if (['development', 'production'].find((valid) => mode === valid) == null) {
    throw new Error('You must provide a "mode" (development|production) to the webpackConfigFactory.');
  }

  const relayPluginPath = path.join(dataDir, 'babel-relay-plugin');

  const isDev = (mode === 'development');
  const isProd = (mode === 'production');
  const isClient = (target === 'client');
  const isServer = (target === 'server');

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifClient = ifElse(isClient);
  const ifServer = ifElse(isServer);
  const ifDevClient = ifElse(isDev && isClient);
  const ifDevServer = ifElse(isDev && isServer);
  const ifProdClient = ifElse(isProd && isClient);

  return {
    target: ifServer('node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true,
    },
    externals: removeEmpty([
      ifServer(nodeExternals({
        // Add any dependencies here that need to be processed by Webpack
        binaryDirs: [
          'blueprint',
        ],
      })),
    ]),
    devtool: ifElse(isServer || isDev)(
      'source-map',
      'hidden-source-map'
    ),
    entry: merge(
      {
        main: removeEmpty([
          ifDevClient('react-hot-loader/patch'),
          ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${clientDevServerPort}/__webpack_hmr`),
          path.resolve(projectRoot, `./${target}.js`),
        ]),
      }
    ),
    output: {
      path: path.resolve(projectRoot, `./build/${target}`),
      filename: ifProdClient('[name]-[hash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://localhost:${clientDevServerPort}/assets/`,
        '/assets/'
      ),
      libraryTarget: ifServer('commonjs2', 'var'),
    },
    resolve: {
      modules: [
        appDir,
        'node_modules',
      ],
      // These extensions are tried when resolving a file.
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
    },
    plugins: removeEmpty([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(mode),
        },
      }),

      // Generates a JSON file containing a map of all the output files for
      // our webpack bundle.  A necessisty for our server rendering process
      // as we need to interogate these files in order to know what JS/CSS
      // we need to inject into our HTML.
      new AssetsPlugin({
        filename: 'assets.json',
        path: path.resolve(projectRoot, `./build/${target}`),
      }),

      ifDev(new webpack.NoErrorsPlugin()),
      ifDevClient(new webpack.HotModuleReplacementPlugin()),
      ifDevServer(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})),

      ifProdClient(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
        })
      ),

      ifProdClient(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true, // eslint-disable-line camelcase
            warnings: false,
          },
        })
      ),

      ifProd(new webpack.optimize.DedupePlugin()),

      ifProdClient(
        new ExtractTextPlugin({filename: '[name]-[chunkhash].css', allChunks: true})
      ),
    ]),
    module: {
      loaders: [
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'file-loader',
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [/node_modules/, buildDir],
          query: merge(
            {
              env: {
                development: {
                  presets: [
                    {plugins: [relayPluginPath]},
                  ],
                  plugins: [
                    'react-hot-loader/babel',
                  ],
                },
              },
            },
            ifServer({
              presets: [
                {plugins: [relayPluginPath]},
                'stage-2',
                'react',
              ],
              plugins: [
                'transform-class-properties',
                'transform-export-extensions',
              ],
            }),
            ifClient({
              // For our clients code we will need to transpile our JS into
              // ES5 code for wider browser/device compatability.
              presets: [
                {plugins: [relayPluginPath]},
                ['es2015', {modules: false}],
                'stage-2',
                'react',
              ],
              plugins: [
                'transform-class-properties',
                'transform-export-extensions',
              ],
            })
          ),
        },

        {
          test: /\.json$/,
          loader: 'json-loader',
        },

        merge(
          {test: /\.scss$/},
          ifServer({
            loaders: [
              'css-loader/locals?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
              'sass-loader',
            ],
          }),
          ifProdClient({
            loader: ExtractTextPlugin.extract({
              notExtractLoader: 'style-loader',
              loader: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]!sass-loader!postcss-loader',
            }),
          }),
          ifDevClient({
            loaders: [
              'style-loader',
              {
                loader: 'css-loader',
                query: {
                  sourceMap: true,
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'sass-loader',
                query: {sourceMap: true},
              },
              {
                loader: 'postcss-loader',
                query: {sourceMap: true},
              },
            ],
          })
        ),
      ],
    },
    postcss: [
      postcssDiscardComments(),
      postcssCalc(),
      postcssFlexbugsFixes,
      postcssSelectorMatches,
      postcssWillChange,
      autoprefixer(),
    ],
    sassLoader: {
      includePaths: [
        appDir,
      ],
    },
  };
}
