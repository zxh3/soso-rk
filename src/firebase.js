import * as firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCsLn2-PZXmr-3IJmCpT8sOuTwaUdhNLA8",
  authDomain: "soso-rk.firebaseapp.com",
  databaseURL: "https://soso-rk.firebaseio.com",
  projectId: "soso-rk",
  storageBucket: "soso-rk.appspot.com",
  messagingSenderId: "436116685118"
};

firebase.initializeApp(config);

export default firebase;