// @flow

import loadConfig from '@lemonmade/react-universal-config';

import build from '../build';
import type {BuildModeType} from '../types';

export const command = 'build [mode]';
export const describe = 'Build the server and client bundles';
export const builder = {
  mode: {
    alias: 'm',
    choices: ['production', 'development'],
  },
};

type BuildOptionsType = {
  mode?: BuildModeType,
};

export async function handler(options: BuildOptionsType) {
  const config = await loadConfig();
  await build(config, options);
}
