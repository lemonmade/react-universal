// @flow

import 'babel-core/register';

import fs from 'fs-extra';
import path from 'path';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';

type ConfigType = {
  dataDir: string,
  buildDir: string,
};

export default async function generateSchema({dataDir, buildDir}: ConfigType) {
  const Schema = require(path.join(dataDir, 'schema')).default;

  const result = await graphql(Schema, introspectionQuery);
  if (result.errors) {
    // eslint-disable-next-line no-console
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
    return;
  }

  fs.mkdirpSync(buildDir);

  fs.writeFileSync(
    path.join(buildDir, 'schema.json'),
    JSON.stringify(result, null, 2)
  );

  fs.writeFileSync(
    path.join(buildDir, 'schema.graphql'),
    printSchema(Schema)
  );
}
