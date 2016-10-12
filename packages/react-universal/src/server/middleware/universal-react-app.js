// @flow

import path from 'path';
import IsomorphicRouter from 'isomorphic-relay-router';
import Relay from 'react-relay';
import React from 'react';
import {Provider} from 'react-redux';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';

import type {$Request, $Response, Middleware} from 'express';
import type {ConfigType} from '@lemonmade/react-universal-config';
import type {AppDetailsType} from '..';

import createRenderer from './renderer';

export default function createUniversalReactAppMiddleware(
  {routes, store}: AppDetailsType,
  {serverPort, buildDir}: ConfigType,
): Middleware {
  // $FlowIgnore: need the dynamic require
  const clientBundleAssets = require(path.join(buildDir, 'client', 'assets.json'));
  const render = createRenderer({clientBundleAssets});

  return function universalReactAppMiddleware(request: $Request, response: $Response, next: Middleware) {
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
