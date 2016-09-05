// @flow

import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from 'sections/App';
import NotFound from 'sections/NotFound';

import HomeRoutes from 'sections/Home/Routes';

const routes = (
  <Route path="/" component={App}>
    {HomeRoutes}
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
