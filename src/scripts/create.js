import path from 'path';

export default function createServer(config) {
  return require(path.join(config.buildDir, 'server', 'main.js')).default(config);
}
