// @flow

import 'source-map-support/register';

import path from 'path';
import express from 'express';
import compression from 'compression';
import hpp from 'hpp';
import helmet from 'helmet';
import graphql from 'express-graphql';

import createUniversalReactAppMiddleware from './middleware/universal-react-app';

import type {ConfigType} from '../types';

export default function createApp(appDetails, config: ConfigType) {
  const {webpackClientConfig, serverPort} = config;
  const {schema} = appDetails;
  const universalReactAppMiddleware = createUniversalReactAppMiddleware(appDetails, config);

  // Create our express based server.
  const app = express();

  // Don't expose any software information to hackers.
  app.disable('x-powered-by');

  // Prevent HTTP Parameter pollution.
  app.use(hpp());

  // Content Security Policy
  app.use(helmet.contentSecurityPolicy({
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
    imgSrc: ["'self'"],
    connectSrc: ["'self'", 'ws:'],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'none'"],
    frameSrc: ["'none'"],
  }));

  app.use(helmet.xssFilter());
  app.use(helmet.frameguard('deny'));
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());

  // Response compression.
  app.use(compression());

  app.use('/graphql', graphql({schema, pretty: true, graphiql: true}));

  app.use(
    webpackClientConfig.output.publicPath,
    express.static(webpackClientConfig.output.path)
  );

  app.get('*', universalReactAppMiddleware);

  const listener = app.listen(serverPort);

  if (process.env.NODE_ENV === 'development') {
    console.log(`==> 💚  HTTP Listener is running on port ${serverPort}`); // eslint-disable-line no-console
  }

  return {listener, app};
}
