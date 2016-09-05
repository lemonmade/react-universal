// @flow

import React from 'react';
import Relay from 'react-relay';

function Home({user}) {
  return <div>Welcome, {user.name}! Make some magic happen!</div>;
}

export default Relay.createContainer(Home, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        name
      }
    `,
  },
});
