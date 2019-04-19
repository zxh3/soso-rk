import React from 'react';
import firebase from '../../firebase';

const Login = () => {
  return (
    <div>
      <button onClick={googleLogin}>Login</button>
    </div>
  );
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error(error);
    });
}

export default Login;