// @flow

import loadConfig from '@lemonmade/react-universal-config';

import {start} from '../../server';

export const command = 'start';
export const describe = 'Run the production server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  start(config);
}
