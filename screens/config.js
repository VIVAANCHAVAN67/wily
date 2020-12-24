import firebase from "firebase"
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDEQFIVEl9rUvUbGLCYGq_MKwPzraOXWS8",
    authDomain: "wily-5caf2.firebaseapp.com",
    projectId: "wily-5caf2",
    storageBucket: "wily-5caf2.appspot.com",
    messagingSenderId: "138655311229",
    appId: "1:138655311229:web:b2d54b8654f3ed2c07d814"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()