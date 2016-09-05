// @flow

type BaseActionType = {
  type: string,
};

import {INCREMENT} from 'types';

export function app(state: number = 1, {type}: BaseActionType) {
  if (type !== INCREMENT) { return state; }
  return state + 1;
}
