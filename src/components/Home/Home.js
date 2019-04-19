import React from 'react';
import styles from './Home.module.css';
import { connect } from 'react-redux';
import firebase from '../../firebase';

import SignIn from '../SignIn';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';

import { Icon } from 'semantic-ui-react';

const beforeSignIn = <SignIn></SignIn>;

const afterSignIn = (
  <div className={styles.container}>
    <div className={styles.header}>
      <MainMenu />
      <div className={styles.user}>
        <Icon name="user circle" size="huge" />
        <p>Username</p>
        <button onClick={() => {
          firebase.auth().signOut();
        }}>Sign Out</button>
      </div>
    </div>
    <div className={styles.search}>
      <SearchBar />
    </div>
  </div>
);

const Home = ({ authUser }) => {
  return (
    <div>
      {authUser ? afterSignIn : beforeSignIn }
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(Home);