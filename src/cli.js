import yargs from 'yargs';

import * as build from './scripts/build';
import * as start from './scripts/start';
import * as dev from './scripts/dev';

process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));

yargs
  .usage('$0 <cmd> [args]')
  .command(build)
  .command(start)
  .command(dev)
  .help('h')
  .argv;
