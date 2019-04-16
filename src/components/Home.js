import React from 'react';
import styles from './Home.module.css';
import MainMenu from './MainMenu';

import firebase from '../firebase';
const provider = new firebase.auth.GoogleAuthProvider();

const Home = () => {
  return (
    <div className={styles.container}>
      <MainMenu />
      <button onClick={() => {
        firebase.auth().signInWithPopup(provider)
          .then(result => {
            console.log(result);
          })
          .catch(error => {
            console.error(error);
          });
      }}>login with google</button>
    </div>
  );
}

export default Home;