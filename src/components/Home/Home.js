import React from 'react';
import styles from './Home.module.css';
import { connect } from 'react-redux';
import firebase from '../../firebase';

import SignIn from '../SignIn';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const beforeSignIn = <SignIn></SignIn>;

const afterSignIn = (
  <div className={styles.container}>
    <div className={styles.header}>
      <MainMenu />
      <div className={styles.user}>
        <FontAwesomeIcon icon={faUser} size="3x" color="#0c4266"/>
        <p>Username</p>
        <button onClick={() => {
          firebase.auth().signOut();
        }}>Sign Out</button>
      </div>
    </div>
    <div className={styles.search}>
      <SearchBar/>
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