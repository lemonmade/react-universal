'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRenderer;

var _server = require('react-dom/server');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _values = require('core-js/library/fn/object/values');

var _values2 = _interopRequireDefault(_values);

var _template = require('./template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createRenderer(_ref) {
  var clientBundleAssets = _ref.clientBundleAssets;

  // This takes the assets.json file that was output by webpack for our client
  // bundle and converts it into an object that contains all the paths to our
  // javascript and css files.  Doing this is required as for production
  // configurations we add a hash to our filenames, therefore we won't know the
  // paths of the output by webpack unless we read them from the assets.json file.
  var chunks = (0, _values2.default)(clientBundleAssets);
  var assets = chunks.reduce(function (acc, chunk) {
    if (chunk.js) {
      acc.javascript.push(chunk.js);
    }

    if (chunk.css) {
      acc.css.push(chunk.css);
    }

    return acc;
  }, { javascript: [], css: [] });

  // We prepare a template using the asset data.
  var template = (0, _template2.default)(assets);

  return function renderer() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var rootElement = _ref2.rootElement;
    var initialState = _ref2.initialState;
    var _ref2$meta = _ref2.meta;
    var meta = _ref2$meta === undefined ? {} : _ref2$meta;

    return template({
      meta: meta,
      reactRootElement: rootElement ? (0, _server.renderToString)(rootElement) : '',
      initialState: initialState
    });
  };
}