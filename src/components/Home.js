import React from 'react';
import styles from './Home.module.css';
import MainMenu from './MainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import firebase from '../firebase';
import SearchBar from './SearchBar';
const provider = new firebase.auth.GoogleAuthProvider();

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <MainMenu />
        <div className={styles.user}>
          <FontAwesomeIcon icon={faUser} size="3x" color="#0c4266"/>
          <p>Username</p>
          <button className={styles.login} onClick={() => {
            firebase.auth().signInWithPopup(provider)
              .then(result => {
                console.log(result);
              })
              .catch(error => {
                console.error(error);
              });
          }}>SignIn with google</button>
        </div>
      </div>
      <div className={styles.search}>
        <SearchBar/>
      </div>
    </div>
  );
}

export default Home;