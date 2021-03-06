// @flow

import yargs from 'yargs';

export const command = 'generate <command>';
export const describe = 'Generate different pieces of the application';

export function builder() {
  return yargs.commandDir('generate', {
    exclude: /utilities/,
  });
}

// eslint-disable-next-line no-empty-function
export function handler() {}
