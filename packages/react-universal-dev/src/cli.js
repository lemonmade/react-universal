// @flow

import yargs from 'yargs';

import * as build from './commands/build';
import * as dev from './commands/dev';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.error(err);
});

yargs
  .usage('$0 <cmd> [args]')
  .command(build)
  .command(dev)
  .help('h')
  .argv;
