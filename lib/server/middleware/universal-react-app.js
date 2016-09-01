'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createUniversalReactAppMiddleware;

var _isomorphicRelayRouter = require('isomorphic-relay-router');

var _isomorphicRelayRouter2 = _interopRequireDefault(_isomorphicRelayRouter);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _createMemoryHistory = require('react-router/lib/createMemoryHistory');

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _match = require('react-router/lib/match');

var _match2 = _interopRequireDefault(_match);

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUniversalReactAppMiddleware(appDetails, _ref) {
  var serverPort = _ref.serverPort;

  var render = (0, _renderer2.default)(appDetails);
  var routes = appDetails.routes;
  var createStore = appDetails.createStore;


  return function universalReactAppMiddleware(request, response, next) {
    if (undefined) {
      if (undefined === 'development') {
        console.log('==> 🐌  Handling react route without SSR'); // eslint-disable-line no-console
      }

      var html = render();
      response.status(200).send(html);
      return;
    }

    var history = (0, _createMemoryHistory2.default)(request.originalUrl);
    var networkLayer = new _reactRelay2.default.DefaultNetworkLayer('http://localhost:' + serverPort + '/graphql');

    // Server side handling of react-router.
    // Read more about this here:
    // https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
    (0, _match2.default)({ routes: routes, history: history }, function (error, redirectLocation, renderProps) {
      if (error) {
        response.status(500).send(error.message);
      } else if (redirectLocation) {
        response.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        _isomorphicRelayRouter2.default.prepareData(renderProps, networkLayer).then(renderPreparedData).catch(next);
      } else {
        response.status(404).send('Not found');
      }

      function renderPreparedData(_ref2) {
        var data = _ref2.data;
        var props = _ref2.props;

        var store = createStore();

        var html = render({
          rootElement: _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _isomorphicRelayRouter2.default.render(props)
          ),
          initialState: data
        });
        response.status(200).send(html);
      }
    });
  };
}