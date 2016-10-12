// @flow

import loadConfig from '@lemonmade/react-universal-config';

import runHot from './dev/hot';

export const command = 'dev';
export const describe = 'Run the hot-reloading development server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  await runHot(config);
}
