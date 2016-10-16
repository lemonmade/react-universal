// @flow

import {buildSchema} from 'graphql';

const data = {
  name: 'Chris Sauve',
};

export const schema = buildSchema(`
  type User {
    name: String!
  }

  type Query {
    user: User
  }
`);

export const rootValue = {
  user() { return data; },
};
