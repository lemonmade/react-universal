// @flow

import yargs from 'yargs';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.error(err);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.error(err);
});

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('$0 <cmd> [args]')
  .commandDir('commands')
  .help('h')
  .argv;
