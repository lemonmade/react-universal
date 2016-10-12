// @flow

import yargs from 'yargs';

import * as start from './commands/start';

process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('$0 <cmd> [args]')
  .command(start)
  .help('h')
  .argv;
