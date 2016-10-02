// @flow

export default function start(config, ...rest) {
  const createServer = require(path.join(config.buildDir, 'server', 'main.js')).default;
  const app = createServer(config, ...rest);
  const listener = app.listen(config.serverPort);
  return listener;
}
