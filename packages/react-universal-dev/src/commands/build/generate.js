// @flow

import fs from 'fs-extra';
import path from 'path';

export default function generateBaseFiles(config) {
  fs.mkdirpSync(config.buildDir);

  fs.writeFileSync(path.resolve(config.buildDir, './server.js'), `
    import createServer from '@lemonmade/react-universal/lib/server';

    import schema from 'data/schema';
    import routes from 'sections';
    import createStore from 'store';
    import clientBundleAssets from './client/assets.json';

    const store = createStore();

    export default createServer({schema, routes, store, clientBundleAssets});
  `);

  fs.writeFileSync(path.resolve(config.buildDir, './client.js'), `
    import createClientRenderer from '@lemonmade/react-universal/lib/client';

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
}
