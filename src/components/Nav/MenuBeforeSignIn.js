import React from 'react';
import { Button } from 'semantic-ui-react';

const MenuBeforeSignIn = ({ history }) => {
  return (
    <div>
      <Button 
        primary
        size='small'
        onClick={() => history.push('/signin')}
      >
        Sign In
      </Button>
    </div>
  );
}

export default MenuBeforeSignIn;
