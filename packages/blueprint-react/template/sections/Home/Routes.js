// @flow

import React from 'react';
import IndexRoute from 'react-router/lib/IndexRoute';

import {UserQuery} from 'queries';

function resolveHomeComponent(nextState, cb) {
  System
    .import('./Home')
    .then((home) => cb(null, home.default));
}

export default (
  <IndexRoute
    getComponents={resolveHomeComponent}
    queries={UserQuery}
  />
);
