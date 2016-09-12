// @flow

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import chokidar from 'chokidar';
import createWebpackMiddleware from 'webpack-dev-middleware';
import createWebpackHotMiddleware from 'webpack-hot-middleware';
import {start} from '@lemonmade/react-universal/lib/server';

import webpackConfigFactory from '../../webpack';

class ListenerManager {
  connectionKey = 0;
  connectionMap = {};

  constructor(listener) {
    this.listener = listener;

    listener.on('connection', (connection) => {
      const connectionKey = ++this.connectionKey;
      this.connectionMap[connectionKey] = connection;
      connection.on('close', () => delete this.connectionMap[connectionKey]);
    });
  }

  async dispose() {
    await new Promise((resolve) => {
      Object
        .keys(this.connectionMap)
        .forEach((connectionKey) => {
          this.connectionMap[connectionKey].destroy();
        });

      if (this.listener == null) {
        resolve();
      } else {
        this.listener.close(() => resolve());
      }
    });
  }
}

class HotServer {
  constructor(compiler, config) {
    const createServer = require(path.join(config.buildDir, 'server', 'main.js')).default;
    const app = createServer(config);
    const listener = start(app, config);
    this.listenerManager = new ListenerManager(listener);
  }

  async dispose() {
    if (this.listenerManager == null) { return; }
    await this.listenerManager.dispose();
  }
}

class HotClient {
  constructor(compiler, config) {
    const app = express();
    this.webpackDevMiddleware = createWebpackMiddleware(compiler, {
      quiet: true,
      noInfo: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      publicPath: compiler.options.output.publicPath,
    });

    app.use(this.webpackDevMiddleware);
    app.use(createWebpackHotMiddleware(compiler));

    const listener = app.listen(config.clientDevServerPort);
    this.listenerManager = new ListenerManager(listener);
  }

  async dispose() {
    console.log('DISPOSING CLIENT');
    this.webpackDevMiddleware.close();
    await this.listenerManager.dispose();
  }
}

class HotEnv {
  start = this.start.bind(this);
  restart = this.restart.bind(this);
  compileHotServer = this.compileHotServer.bind(this);

  constructor(config) {
    this.config = config;
  }

  async start() {
    console.log('STARTING');
    const {config} = this;

    this.serverCompiler = webpack(webpackConfigFactory({target: 'server', mode: 'development'}, config));
    this.clientCompiler = webpack(webpackConfigFactory({target: 'client', mode: 'development'}, config));

    this.client = new HotClient(this.clientCompiler, config);

    this.clientCompiler.plugin('done', async (stats) => {
      if (stats.hasErrors()) {
        console.log('CLIENT COMPILER HAD ERRORS');
        console.log(stats.toString());
      }

      console.log('FINISHED CLIENT COMPILER');
      await this.compileHotServer();
    });

    this.serverCompiler.plugin('done', (stats) => {
      if (stats.hasErrors()) {
        console.log('SERVER COMPILER HAD ERRORS');
        console.log(stats.toString());
      }

      console.log('FINISHED SERVER COMPILER');

      // Make sure our newly built server bundles aren't in the module cache.
      Object
        .keys(require.cache)
        .filter((modulePath) => modulePath.indexOf(this.serverCompiler.options.output.path) >= 0)
        .forEach((modulePath) => delete require.cache[modulePath]);

      this.server = new HotServer(this.serverCompiler, config);
    });

    const watcher = chokidar.watch([path.resolve(config.appDir, 'server.js')]);
    watcher.on('ready', () => {
      watcher
        .on('add', this.compileHotServer)
        .on('addDir', this.compileHotServer)
        .on('change', this.compileHotServer)
        .on('unlink', this.compileHotServer)
        .on('unlinkDir', this.compileHotServer);
    });
  }

  async compileHotServer() {
    console.log('COMPILING HOT SERVER');

    if (this.server) {
      await this.server.dispose();
    }

    this.serverCompiler.run(noop);
  }

  async restart() {
    await Promise.all([
      this.client && this.client.dispose(),
      this.server && this.server.dispose(),
    ]);

    this.start();
  }
}

function noop() {}

export default function createHotEnv(config) {
  return new HotEnv(config);
}