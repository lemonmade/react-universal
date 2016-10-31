// @flow
/* eslint-disable no-console, no-process-env */

import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import VisualizerPlugin from 'webpack-visualizer-plugin';

import autoprefixer from 'autoprefixer';
import postcssWillChange from 'postcss-will-change';
import postcssDiscardComments from 'postcss-discard-comments';
import postcssCalc from 'postcss-calc';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssSelectorMatches from 'postcss-selector-matches';

import type {ConfigType} from '@lemonmade/react-universal-config';
import type {BuildModeType, BuildTargetType} from './types';

function removeEmpty<T>(x: Array<?T>): Array<T> {
  return x.filter(Boolean);
}

function ifElse(condition: boolean): <T>(then: ?T, or: ?T) => T | void {
  // $FlowFixMe: this feels like it should work, but doesn't
  return (then, or) => (condition ? then : or);
}

function merge(...args: Array<?Object>): Object {
  return Object.assign({}, ...removeEmpty(args));
}

export default function webpackConfigFactory(
  {target = 'client', mode = 'development'}: {target?: BuildTargetType, mode?: BuildModeType},
  {appDir, clientDevServerPort, buildDir, stylesDir, scriptsDir, webpackConfigurator}: ConfigType,
): Object {
  if (['client', 'server'].find((valid) => target === valid) == null) {
    throw new Error('You must provide a "target" (client|server) to the webpackConfigFactory.');
  }

  if (['development', 'production'].find((valid) => mode === valid) == null) {
    throw new Error('You must provide a "mode" (development|production) to the webpackConfigFactory.');
  }

  console.log(`GENERATING ${target} CONFIG IN ${mode}`);

  const relayPluginPath = path.join(scriptsDir, 'babel-relay-plugin');

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

  const finalBuildDir = path.join(buildDir, target);

  const config = {
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
        whitelist: [
          /^relay\/.+/,
        ],
      })),
    ]),
    devtool: ifElse(isServer || isDev)(
      'source-map',
      'hidden-source-map',
    ),
    entry: merge(
      {
        main: removeEmpty([
          ifDevClient('react-hot-loader/patch'),
          ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${clientDevServerPort}/__webpack_hmr`),
          path.resolve(appDir, `${target}.js`),
        ]),
      },
      ifClient({
        vendor: [
          'react',
          'react-dom',
          'react-relay',
          'isomorphic-relay',
          'isomorphic-relay-router',
          'graphql',
          'redux',
          'react-redux',
        ],
      }),
    ),
    output: {
      path: finalBuildDir,
      filename: ifProdClient('[name]-[hash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://localhost:${clientDevServerPort}/assets/`,
        '/assets/',
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
        path: finalBuildDir,
      }),

      new VisualizerPlugin(),

      ifDev(new webpack.NoErrorsPlugin()),
      ifDevClient(new webpack.HotModuleReplacementPlugin()),
      ifDevServer(new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})),

      ifClient(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity,
        }),
      ),

      ifProdClient(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
        }),
      ),

      ifProd(new webpack.optimize.DedupePlugin()),

      ifProdClient(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            // eslint-disable-next-line camelcase
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            // eslint-disable-next-line camelcase
            screw_ie8: true,
          },
          output: {
            comments: false,
            // eslint-disable-next-line camelcase
            screw_ie8: true,
          },
        }),
      ),

      ifProdClient(
        new ExtractTextPlugin({filename: '[name]-[chunkhash].css', allChunks: true}),
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
          exclude: /node_modules/,
          query: merge(
            {
              env: {
                development: {
                  presets: [
                    {plugins: [relayPluginPath]},
                  ],
                  plugins: ['react-hot-loader/babel'],
                },
              },
            },
            ifServer({
              presets: [
                ['shopify/node', {modules: false}],
                'shopify/react',
              ],
            }),
            ifClient({
              presets: [
                ['shopify/web', {modules: false}],
                'shopify/react',
              ],
            }),
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
              {
                loader: 'css-loader/locals',
                query: {
                  modules: true,
                  importLoaders: 1,
                  localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                },
              },
              {
                loader: 'sass-loader',
                query: {
                  includePaths: [
                    stylesDir,
                  ],
                },
              },
            ],
          }),
          ifProdClient({
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: [
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
                  query: {
                    includePaths: [
                      stylesDir,
                    ],
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: [
                      postcssDiscardComments(),
                      postcssCalc(),
                      postcssFlexbugsFixes,
                      postcssSelectorMatches,
                      postcssWillChange,
                      autoprefixer(),
                    ],
                  },
                },
              ],
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
                query: {
                  sourceMap: true,
                  includePaths: [
                    stylesDir,
                  ],
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  plugins: [
                    postcssDiscardComments(),
                    postcssCalc(),
                    postcssFlexbugsFixes,
                    postcssSelectorMatches,
                    postcssWillChange,
                    autoprefixer(),
                  ],
                },
              },
            ],
          }),
        ),
      ],
    },
  };

  return webpackConfigurator(config, {target, mode});
}
