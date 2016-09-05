'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRenderer;

var _server = require('react-dom/server');

var _values = require('core-js/library/fn/object/values');

var _values2 = _interopRequireDefault(_values);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRenderer({ clientBundleAssets }) {
  // This takes the assets.json file that was output by webpack for our client
  // bundle and converts it into an object that contains all the paths to our
  // javascript and css files.  Doing this is required as for production
  // configurations we add a hash to our filenames, therefore we won't know the
  // paths of the output by webpack unless we read them from the assets.json file.
  const chunks = (0, _values2.default)(clientBundleAssets);
  const assets = chunks.reduce((acc, chunk) => {
    if (chunk.js) {
      acc.javascript.push(chunk.js);
    }

    if (chunk.css) {
      acc.css.push(chunk.css);
    }

    return acc;
  }, { javascript: [], css: [] });

  // We prepare a template using the asset data.
  const template = (0, _template2.default)(assets);

  return function renderer({ rootElement, initialState, meta = {} } = {}) {
    return template({
      meta,
      reactRootElement: rootElement ? (0, _server.renderToString)(rootElement) : '',
      initialState
    });
  };
}