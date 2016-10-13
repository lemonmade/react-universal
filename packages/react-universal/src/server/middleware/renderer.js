// @flow

import {renderToString} from 'react-dom/server';
import objectValues from 'core-js/library/fn/object/values';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';

type RenderOptionsType = {
  rootElement?: React$Element<*>,
  initialState?: Object,
};

type AssetType = {
  js?: string,
  css?: string,
};

function cssImports(css) {
  return css
    .map((cssPath) => `<link href="${cssPath}" rel="stylesheet" type="text/css" />`)
    .join('\n');
}

const VENDOR_REGEX = /vendor/;
function javascriptImports(javascript) {
  return javascript
    .sort((scriptOne, scriptTwo) => {
      if (scriptOne.match(VENDOR_REGEX)) {
        return -1;
      } else if (scriptTwo.match(VENDOR_REGEX)) {
        return 1;
      } else {
        return 0;
      }
    })
    .map((scriptPath) => `<script type="text/javascript" src="${scriptPath}" defer></script>`)
    .join('\n');
}

export default function createRenderer({clientBundleAssets}: {clientBundleAssets: AssetType[]}) {
  // This takes the assets.json file that was output by webpack for our client
  // bundle and converts it into an object that contains all the paths to our
  // javascript and css files.  Doing this is required as for production
  // configurations we add a hash to our filenames, therefore we won't know the
  // paths of the output by webpack unless we read them from the assets.json file.
  const chunks = objectValues(clientBundleAssets);
  const {css, javascript} = chunks.reduce((acc, chunk) => {
    if (chunk.js) {
      acc.javascript.push(chunk.js);
    }

    if (chunk.css) {
      acc.css.push(chunk.css);
    }

    return acc;
  }, {javascript: [], css: []});

  return function renderer({rootElement, initialState}: RenderOptionsType = {}) {
    const rootElementString = rootElement ? renderToString(rootElement) : '';
    const helmet = rootElement ? Helmet.rewind() : null;

    return `
      <!DOCTYPE html>
      <html ${helmet ? helmet.htmlAttributes.toString() : 'lang="en"'}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1">

          ${helmet ? helmet.title.toString() : ''}
          ${helmet ? helmet.meta.toString() : ''}
          ${helmet ? helmet.link.toString() : ''}

          ${cssImports(css)}
          ${helmet ? helmet.style.toString() : ''}
        </head>
        <body>
          <div id='app'>${rootElementString}</div>

          <script type='text/javascript'>
            window.APP_STATE=${serialize(initialState)};
          </script>

          ${javascriptImports(javascript)}
          ${helmet ? helmet.script.toString() : ''}
        </body>
      </html>
    `;
  };
}
