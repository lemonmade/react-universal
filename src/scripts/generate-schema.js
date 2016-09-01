// @flow

import fs from 'fs-extra';
import path from 'path';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';

import type {ConfigType} from '../types';

export default async function generateSchema({dataDir}: ConfigType) {
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

  fs.writeFileSync(
    path.join(dataDir, 'schema.json'),
    JSON.stringify(result, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'schema.graphql'),
    printSchema(Schema)
  );
}
