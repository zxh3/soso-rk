import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyCitw_e0taWWQjSUh11IAB4gtlNpojVpo4",
  authDomain: "soso-test-c57de.firebaseapp.com",
  databaseURL: "https://soso-test-c57de.firebaseio.com",
  projectId: "soso-test-c57de",
  storageBucket: "soso-test-c57de.appspot.com",
  messagingSenderId: "720314873238"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default firebase;
