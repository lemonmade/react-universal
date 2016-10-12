// @flow

import 'babel-core/register';

import fs from 'fs-extra';
import path from 'path';
import {graphql} from 'graphql';
import {introspectionQuery, printSchema} from 'graphql/utilities';
import type {ConfigType} from '@lemonmade/react-universal-config';

export default async function generateSchema({dataDir, buildDir}: ConfigType): Promise<void> {
  // $FlowIgnore: need the dynamic require in this case.
  const Schema = require(path.join(dataDir, 'schema')).default;

  const result = await graphql(Schema, introspectionQuery);
  if (result.errors) {
    // eslint-disable-next-line no-console
    console.error(
      'ERROR introspecting schema: ',
      result.errors[0],
    );
    return;
  }

  fs.mkdirpSync(buildDir);

  fs.writeFileSync(
    path.join(buildDir, 'schema.json'),
    JSON.stringify(result, null, 2),
  );

  fs.writeFileSync(
    path.join(buildDir, 'schema.graphql'),
    printSchema(Schema),
  );
}
