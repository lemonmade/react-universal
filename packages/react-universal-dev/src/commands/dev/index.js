// @flow

import path from 'path';
import loadConfig from '@lemonmade/react-universal-config';

import createHotEnv from './hot';
import generateBaseFiles from '../build/generate';

export const command = 'dev';
export const describe = 'Run the hot-reloading development server';
export const builder = {};

export async function handler() {
  const config = await loadConfig();
  generateBaseFiles(config);
  const env = createHotEnv(config);
  await env.start();
}
