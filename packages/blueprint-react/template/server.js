
// @flow

import {createServer} from 'blueprint';

import schema from './data/schema';
import routes from './app/routes';
import createStore from './app/store';
import clientBundleAssets from './build/assets.json';

const store = createStore();

export default createServer({schema, routes, store, clientBundleAssets});
