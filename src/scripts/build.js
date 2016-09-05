import webpack from 'webpack';

import createWebpackConfig from '../webpack';
import config from '../config';

export default async function build({mode = 'production'} = {}) {
  const clientConfig = createWebpackConfig({target: 'client', mode}, config);
  const serverConfig = createWebpackConfig({target: 'server', mode}, config);

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(serverConfig);

  await runCompiler(clientCompiler);
  await runCompiler(serverCompiler);
}

async function runCompiler(compiler) {
  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(stats.toString());
        reject(err);
        return;
      }

      resolve();
    });
  });
}
