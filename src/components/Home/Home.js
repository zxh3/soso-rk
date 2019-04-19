import React from 'react';
import styles from './Home.module.css';
import { connect } from 'react-redux';

import Login from '../Login';
import MainMenu from './MainMenu';
import SearchBar from './SearchBar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Home = ({ authUser }) => {
  const beforeLogin = <Login></Login>;
  const afterLogin = (
    <div className={styles.container}>
      <div className={styles.header}>
        <MainMenu />
        <div className={styles.user}>
          <FontAwesomeIcon icon={faUser} size="3x" color="#0c4266"/>
          <p>Username</p>
        </div>
      </div>
      <div className={styles.search}>
        <SearchBar/>
      </div>
    </div>
  );

  return (
    <div>
      {authUser ? afterLogin : beforeLogin }
    </div>
  );
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser
});

export default connect(mapStateToProps)(Home);