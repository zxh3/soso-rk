import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../SignIn';
import Nav from '../Nav';
import Home from '../Home';
import Profile from '../Profile';
import { NotePage } from '../Note'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()

const App = () => {
  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}><Nav /></div>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/signin' component={SignIn} />
        <Route path='/n/:noteid' component={NotePage} />
        <Route path='/:username' component={Profile} />
      </Switch>
    </>
  );
}

export default App;
