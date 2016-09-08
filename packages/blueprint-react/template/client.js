// @flow

import {createClientRenderer} from 'blueprint';

import initialRoutes from 'routes';
import createStore from 'store';

const store = createStore();
const renderApp = createClientRenderer({store});

renderApp(initialRoutes);

// The following is needed so that we can hot reload our App.
if (module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept('../app/routes/index.js', () => {
    const newRoutes = require('../app/routes/index.js').default;

    renderApp(newRoutes);
  });
}
