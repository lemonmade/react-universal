// @flow

import path from 'path';
import config from '../config';

export default function start() {
  try {
    require(path.join(config.buildDir, 'server', 'main.js'));
  } catch (err) {
    console.error(err);
  }
}
