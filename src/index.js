import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyD5374aDsEL2hovYav7bswJeImhVo6knmo",
  authDomain: "mhstorage-9a431.firebaseapp.com",
  projectId: "mhstorage-9a431",
  storageBucket: "mhstorage-9a431.appspot.com",
  messagingSenderId: "288424384392",
  appId: "1:288424384392:web:6ad2e0cce2fec5bacdcc3d",
  measurementId: "G-7R7N5N7F4G",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
