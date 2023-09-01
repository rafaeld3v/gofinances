import firebase from "firebase/compat/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrb3UwIjhgMk8qkALq4D9nqs0ZKepv-zc",
  authDomain: "gofinances-fd7ee.firebaseapp.com",
  projectId: "gofinances-fd7ee",
  storageBucket: "gofinances-fd7ee.appspot.com",
  messagingSenderId: "40243278165",
  appId: "1:40243278165:web:aa5fb4e4d588d6b8e57fdc",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
