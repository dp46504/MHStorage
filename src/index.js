import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebase from "firebase";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
