// @flow

import React from 'react';
import Route from 'react-router/lib/Route';

import App from './App';
import NotFound from './NotFound';

import HomeRoutes from './Home';

const routes = (
  <Route path="/" component={App}>
    {HomeRoutes}
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
