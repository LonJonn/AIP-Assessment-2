import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

// Ensure only one firebase instance is created
if (!firebase.apps.length) {
  firebase.initializeApp({
    authDomain: "aip-assessment-2.firebaseapp.com",
    databaseURL: "https://aip-assessment-2.firebaseio.com",
    projectId: "aip-assessment-2",
    storageBucket: "aip-assessment-2.appspot.com",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    messagingSenderId: process.env.NEXT_PUBLIC_MSG_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
}

export { firebase };
