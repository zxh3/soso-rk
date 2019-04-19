import React from 'react';
import styles from './SignIn.module.css';
import GoogleButton from 'react-google-button'
import firebase, { auth, db } from '../../firebase';

const Login = () => {
  return (
    <div className={styles.container}>
      <GoogleButton onClick={googleLogin}>Login</GoogleButton>
    </div>
  );
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(({ user }) => {
      const { uid, email, displayName } = user;
      db.collection('users').doc(uid).set({ 
        email, 
        displayName,
        following: [],
        followers: [],
        saved: [],
        posts: []
      }, { merge: true });
    })
    .catch(error => {
      console.error(error);
    });
}

export default Login;