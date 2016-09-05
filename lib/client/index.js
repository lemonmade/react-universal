'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createClientRenderer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRelay = require('react-relay');

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _isomorphicRelay = require('isomorphic-relay');

var _isomorphicRelay2 = _interopRequireDefault(_isomorphicRelay);

var _isomorphicRelayRouter = require('isomorphic-relay-router');

var _isomorphicRelayRouter2 = _interopRequireDefault(_isomorphicRelayRouter);

var _reactDom = require('react-dom');

var _reactHotLoader = require('react-hot-loader');

var _reactRedux = require('react-redux');

var _Router = require('react-router/lib/Router');

var _Router2 = _interopRequireDefault(_Router);

var _browserHistory = require('react-router/lib/browserHistory');

var _browserHistory2 = _interopRequireDefault(_browserHistory);

var _match = require('react-router/lib/match');

var _match2 = _interopRequireDefault(_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env browser */

function createClientRenderer({ store }) {
  const environment = new _reactRelay2.default.Environment();
  environment.injectNetworkLayer(new _reactRelay2.default.DefaultNetworkLayer('/graphql'));
  const data = window.APP_STATE;

  _isomorphicRelay2.default.injectPreparedData(environment, data);

  // Get the DOM Element that will host our React application.
  const container = document.querySelector('#app');

  return function renderApp(routes) {
    // As we are using dynamic react-router routes we have to use the following
    // asynchronous routing mechanism supported by the `match` function.
    // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
    (0, _match2.default)({ history: _browserHistory2.default, routes }, (error, redirectLocation, renderProps) => {
      if (error) {
        console.log('==> 😭  React Router match failed.'); // eslint-disable-line no-console
      }

      _isomorphicRelayRouter2.default.prepareInitialRender(environment, renderProps).then(props => {
        return (0, _reactDom.render)(_react2.default.createElement(
          _reactHotLoader.AppContainer,
          null,
          _react2.default.createElement(
            _reactRedux.Provider,
            { store: store },
            _react2.default.createElement(_Router2.default, props)
          )
        ), container);
      });
    });
  };
}