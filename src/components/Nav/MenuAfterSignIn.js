import React from 'react';
import { Icon } from 'semantic-ui-react';

const MenuAfterSignIn = ({ authUser, history }) => {
  const username = authUser.email.split('@')[0];
  return (
    <div style={{ cursor: 'pointer' }}>
      <Icon name='user outline' size='large' onClick={() => history.push(`/${username}`)} />
    </div>
  );
}

export default MenuAfterSignIn;
