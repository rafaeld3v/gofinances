import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyBI7iRSL8U1j0ToXBXW_O0Yaqoz1ou1m6s",
  authDomain: "gofinances-rafaeld3v.firebaseapp.com",
  projectId: "gofinances-rafaeld3v",
  storageBucket: "gofinances-rafaeld3v.appspot.com",
  messagingSenderId: "49891934433",
  appId: "1:49891934433:web:2979e71d91e315eb6db7a0",
  measurementId: "G-D7ZXKT1Q1C",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
