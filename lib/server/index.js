'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createApp;

require('source-map-support/register');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _hpp = require('hpp');

var _hpp2 = _interopRequireDefault(_hpp);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _universalReactApp = require('./middleware/universal-react-app');

var _universalReactApp2 = _interopRequireDefault(_universalReactApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createApp(appDetails, config) {
  var webpackClientConfig = config.webpackClientConfig;
  var serverPort = config.serverPort;
  var schema = appDetails.schema;

  var universalReactAppMiddleware = (0, _universalReactApp2.default)(appDetails, config);

  // Create our express based server.
  var app = (0, _express2.default)();

  // Don't expose any software information to hackers.
  app.disable('x-powered-by');

  // Prevent HTTP Parameter pollution.
  app.use((0, _hpp2.default)());

  // Content Security Policy
  app.use(_helmet2.default.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'", 'ws:'],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"]
  }));

  app.use(_helmet2.default.xssFilter());
  app.use(_helmet2.default.frameguard('deny'));
  app.use(_helmet2.default.ieNoOpen());
  app.use(_helmet2.default.noSniff());

  // Response compression.
  app.use((0, _compression2.default)());

  app.use('/graphql', (0, _expressGraphql2.default)({ schema: schema, pretty: true, graphiql: true }));

  app.use(webpackClientConfig.output.publicPath, _express2.default.static(webpackClientConfig.output.path));

  app.get('*', universalReactAppMiddleware);

  var listener = app.listen(serverPort);

  if (undefined === 'development') {
    console.log('==> 💚  HTTP Listener is running on port ' + serverPort); // eslint-disable-line no-console
  }

  return { listener: listener, app: app };
}