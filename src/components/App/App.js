import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../SignIn';
import Nav from '../Nav';
import Home from '../Home';
import Profile from '../Profile';

const App = () => {
  return (
    <>
      <Nav />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/signin' component={SignIn} />
        <Route path='/:username' component={Profile} />
      </Switch>
    </>
  );
}

export default App;
