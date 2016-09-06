import yargs from 'yargs';

import build from './scripts/build';
import start from './scripts/start';
import dev from './scripts/dev';

process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));

export default async function cli() {
  const argv = yargs.argv;

  switch (argv._[0]) {
    case 'build': return await build({mode: 'production'});
    case 'start': return start();
    case 'dev': return await dev();
  }

  console.error('Command not found');
  return null;
}
