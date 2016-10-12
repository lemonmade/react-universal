// @flow

import {renderToString} from 'react-dom/server';
import objectValues from 'core-js/library/fn/object/values';

import createTemplate from './template';

type RenderOptionsType = {
  rootElement?: React$Element<*>,
  initialState?: Object,
  meta?: Object,
};

type AssetType = {
  js?: string,
  css?: string,
};

export default function createRenderer({clientBundleAssets}: {clientBundleAssets: AssetType[]}) {
  // This takes the assets.json file that was output by webpack for our client
  // bundle and converts it into an object that contains all the paths to our
  // javascript and css files.  Doing this is required as for production
  // configurations we add a hash to our filenames, therefore we won't know the
  // paths of the output by webpack unless we read them from the assets.json file.
  const chunks = objectValues(clientBundleAssets);
  const assets = chunks.reduce((acc, chunk) => {
    if (chunk.js) {
      acc.javascript.push(chunk.js);
    }

    if (chunk.css) {
      acc.css.push(chunk.css);
    }

    return acc;
  }, {javascript: [], css: []});

  // We prepare a template using the asset data.
  const template = createTemplate(assets);

  return function renderer({rootElement, initialState, meta = {}}: RenderOptionsType = {}) {
    return template({
      meta,
      reactRootElement: rootElement ? renderToString(rootElement) : '',
      initialState,
    });
  };
}
