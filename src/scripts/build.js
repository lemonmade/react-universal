import webpack from 'webpack';
import config from '../config';

const clientCompiler = webpack(config.webpackClientConfig);
const serverCompiler = webpack(config.webpackServerConfig);

const noop = (err, stats) => {
  console.log(stats.hasErrors(), stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true,
  }));
};

clientCompiler.run(noop);
serverCompiler.run(noop);
