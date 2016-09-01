'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTemplate;

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cssImports(css) {
  return css.map(function (cssPath) {
    return '<link href="' + cssPath + '" rel="stylesheet" type="text/css" />';
  }).join('\n');
}

function javascriptImports(javascript) {
  return javascript.map(function (scriptPath) {
    return '<script type="text/javascript" src="' + scriptPath + '" defer></script>';
  }).join('\n');
}

function metaTags(meta) {
  return Object.keys(meta).map(function (metaKey) {
    return '<meta name="' + metaKey + '" content="' + meta[metaKey] + '" />';
  });
}

// :: Assets -> Content -> String
function createTemplate() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$css = _ref.css;
  var css = _ref$css === undefined ? [] : _ref$css;
  var _ref$javascript = _ref.javascript;
  var javascript = _ref$javascript === undefined ? [] : _ref$javascript;

  return function template() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref2$meta = _ref2.meta;
    var meta = _ref2$meta === undefined ? {} : _ref2$meta;
    var _ref2$initialState = _ref2.initialState;
    var initialState = _ref2$initialState === undefined ? {} : _ref2$initialState;
    var reactRootElement = _ref2.reactRootElement;

    return '\n      <!DOCTYPE html>\n      <html lang=\'en\'>\n        <head>\n          <meta charSet="utf-8" />\n          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />\n          <meta httpEquiv="Content-Language" content="en" />\n          <meta name="viewport" content="width=device-width, initial-scale=1">\n\n          <title>Shopify</title>\n\n          ' + metaTags(meta) + '\n\n          ' + cssImports(css) + '\n        </head>\n        <body>\n          <div id=\'app\'>' + reactRootElement + '</div>\n\n          <script type=\'text/javascript\'>\n            window.APP_STATE=' + (0, _serializeJavascript2.default)(initialState) + ';\n          </script>\n\n          ' + javascriptImports(javascript) + '\n        </body>\n      </html>\n    ';
  };
}