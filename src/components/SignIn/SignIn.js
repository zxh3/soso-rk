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
      const { uid, email, displayName, photoURL } = user;
      const username = email.split('@')[0];
      db.collection('users').doc(uid).get()
        .then((doc) => {
          if (doc.exists) {
            db.collection('users').doc(uid).update({
              email,
              username,
              displayName,
              photoURL 
            })
            .then(() => console.log('successfuly update user info'))
            .catch((error) => console.error(error));
          } else {
            db.collection('users').doc(uid).set({ 
              email,
              username,
              displayName,
              photoURL,
              following: [],
              followers: [],
              saved: [],
              notes: [],
              prohibitTags: [],
            })
            .then(() => console.log('successfully create new user'))
            .catch((error) => console.error(error));
          }
        })
        .catch((error) => console.error(error))
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