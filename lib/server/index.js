'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createServerFactory;

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

function createServerFactory(appDetails, configurator = () => {}) {
  return function createServer(config) {
    const publicPath = config.publicPath;
    const buildDir = config.buildDir;
    const schema = appDetails.schema;

    const universalReactAppMiddleware = (0, _universalReactApp2.default)(appDetails, config);

    // Create our express based server.
    const app = (0, _express2.default)();

    configurator(app);

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

    app.use('/graphql', (0, _expressGraphql2.default)({ schema, pretty: true, graphiql: true }));

    app.use(publicPath, _express2.default.static(_path2.default.join(buildDir, 'client'), { maxAge: '365d' }));

    app.get('*', universalReactAppMiddleware);

    return app;
  };
}