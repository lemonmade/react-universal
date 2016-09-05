'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTemplate;

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cssImports(css) {
  return css.map(cssPath => `<link href="${ cssPath }" rel="stylesheet" type="text/css" />`).join('\n');
}

function javascriptImports(javascript) {
  return javascript.map(scriptPath => `<script type="text/javascript" src="${ scriptPath }" defer></script>`).join('\n');
}

function metaTags(meta) {
  return Object.keys(meta).map(metaKey => `<meta name="${ metaKey }" content="${ meta[metaKey] }" />`);
}

// :: Assets -> Content -> String
function createTemplate({ css = [], javascript = [] } = {}) {
  return function template({ meta = {}, initialState = {}, reactRootElement } = {}) {
    return `
      <!DOCTYPE html>
      <html lang='en'>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Content-Language" content="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1">

          <title>Shopify</title>

          ${ metaTags(meta) }

          ${ cssImports(css) }
        </head>
        <body>
          <div id='app'>${ reactRootElement }</div>

          <script type='text/javascript'>
            window.APP_STATE=${ (0, _serializeJavascript2.default)(initialState) };
          </script>

          ${ javascriptImports(javascript) }
        </body>
      </html>
    `;
  };
}