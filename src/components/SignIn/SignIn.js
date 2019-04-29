import React from 'react';
import styles from './SignIn.module.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleButton from 'react-google-button'
import { Loader } from 'semantic-ui-react';
import firebase, { auth, db } from '../../firebase';

const SignIn = ({ authLoading, authUser, history }) => {
  if (authLoading) {
    return <Loader active />
  } else if (authUser !== null) {
    return <Redirect to='/' />
  }
  return (
    <div className={styles.container}>
      <GoogleButton onClick={() => googleLogin(history)}>SignIn</GoogleButton>
    </div>
  );
}

function googleLogin(history) {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(({ user }) => {
      const { uid, email, displayName } = user;
      db.collection('users').doc(uid).set({ 
        email,
        username: email.split('@')[0],
        displayName,
        following: [],
        followers: [],
        saved: [],
        notes: []
      }, { merge: true });
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      history.push('/');
    });
}

const mapStateToProps = (state) => ({
  authUser: state.auth.authUser,
  authLoading: state.auth.loading
});

export default connect(mapStateToProps)(SignIn);