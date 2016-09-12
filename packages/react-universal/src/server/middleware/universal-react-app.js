// @flow

import path from 'path';
import IsomorphicRouter from 'isomorphic-relay-router';
import Relay from 'react-relay';
import React from 'react';
import {Provider} from 'react-redux';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';

import createRenderer from './renderer';

export default function createUniversalReactAppMiddleware(appDetails, {serverPort, buildDir}) {
  const clientBundleAssets = require(path.join(buildDir, 'client', 'assets.json'));
  const render = createRenderer({...appDetails, clientBundleAssets});
  const {routes, store} = appDetails;

  return function universalReactAppMiddleware(request, response, next) {
    if (process.env.DISABLE_SSR) {
      if (process.env.NODE_ENV === 'development') {
        console.log('==> 🐌  Handling react route without SSR');  // eslint-disable-line no-console
      }

      const html = render();
      response.status(200).send(html);
      return;
    }

    const history = createMemoryHistory(request.originalUrl);
    const networkLayer = new Relay.DefaultNetworkLayer(`http://localhost:${serverPort}/graphql`);

    // Server side handling of react-router.
    // Read more about this here:
    // https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
    match({routes, history}, (error, redirectLocation, renderProps) => {
      if (error) {
        response.status(500).send(error.message);
      } else if (redirectLocation) {
        response.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        IsomorphicRouter
          .prepareData(renderProps, networkLayer)
          .then(renderPreparedData)
          .catch(next);
      } else {
        response.status(404).send('Not found');
      }

      function renderPreparedData({data, props}) {
        const html = render({
          rootElement: (
            <Provider store={store}>
              {IsomorphicRouter.render(props)}
            </Provider>
          ),
          initialState: data,
        });
        response.status(200).send(html);
      }
    });
  };
}