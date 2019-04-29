import React from 'react';
import { Button } from 'semantic-ui-react';
import { auth } from '../../firebase';

const MenuAfterSignIn = () => {
  return (
    <div>
      <Button 
        primary 
        size='small'
        onClick={() => auth.signOut()}
      >
        Sign Out
      </Button>
    </div>
  );
}

export default MenuAfterSignIn;
