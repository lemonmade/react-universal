export default function start(app, config) {
  const listener = app.listen(config.serverPort);
  return listener;
}
