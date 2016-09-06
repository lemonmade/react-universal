import createHotEnv from '../server/hot';

export default async function dev() {
  const env = createHotEnv();
  await env.start();
}
