import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import loadConfig from '@lemonmade/react-universal-config';

import createWebpackConfig from '../../webpack';

export const command = 'build [mode]';
export const describe = 'Build the server and client bundles';
export const builder = {
  mode: {
    alias: 'm',
    choices: ['production', 'development'],
  },
};

export async function handler({mode = 'production'}) {
  const config = await loadConfig();

  fs.mkdirp(config.buildDir);

  fs.writeFileSync(path.resolve(config.buildDir, './server.js'), `
    import {createServer} from 'blueprint';

    import schema from 'data/schema';
    import routes from 'sections';
    import createStore from 'store';
    import clientBundleAssets from './client/assets.json';

    const store = createStore();

    export default createServer({schema, routes, store, clientBundleAssets});
  `);

  fs.writeFileSync(path.resolve(config.buildDir, './client.js'), `
    import createClientRenderer from 'blueprint/lib/client';

    import initialRoutes from 'sections';
    import createStore from 'store';

    const store = createStore();
    const renderApp = createClientRenderer({store});

    renderApp(initialRoutes);

    // The following is needed so that we can hot reload our App.
    if (module.hot) {
      module.hot.accept('./client.js');
      module.hot.accept('sections/index.js', () => {
        const newRoutes = require('sections/index.js').default;

        renderApp(newRoutes);
      });
    }
  `);

  const clientConfig = createWebpackConfig({target: 'client', mode}, config);
  const serverConfig = createWebpackConfig({target: 'server', mode}, config);

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  await runCompiler(clientCompiler);
  await runCompiler(serverCompiler);
}

async function runCompiler(compiler) {
  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(stats.toString());
        reject(err);
        return;
      }

      resolve();
    });
  });
}
