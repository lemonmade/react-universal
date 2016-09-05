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

function createUniversalReactAppMiddleware(appDetails, { serverPort }) {
  const render = (0, _renderer2.default)(appDetails);
  const routes = appDetails.routes;
  const store = appDetails.store;


  return function universalReactAppMiddleware(request, response, next) {
    if (undefined) {
      if (undefined === 'development') {
        console.log('==> 🐌  Handling react route without SSR'); // eslint-disable-line no-console
      }

      const html = render();
      response.status(200).send(html);
      return;
    }

    const history = (0, _createMemoryHistory2.default)(request.originalUrl);
    const networkLayer = new _reactRelay2.default.DefaultNetworkLayer(`http://localhost:${ serverPort }/graphql`);

    // Server side handling of react-router.
    // Read more about this here:
    // https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
    (0, _match2.default)({ routes, history }, (error, redirectLocation, renderProps) => {
      if (error) {
        response.status(500).send(error.message);
      } else if (redirectLocation) {
        response.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        _isomorphicRelayRouter2.default.prepareData(renderProps, networkLayer).then(renderPreparedData).catch(next);
      } else {
        response.status(404).send('Not found');
      }

      function renderPreparedData({ data, props }) {
        const html = render({
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