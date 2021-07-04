import React, { useContext } from "react";
import firebase from "firebase";
import CheckIfLoggedIn from "../Helpers/CheckIfLoggedIn";
import UserContext from "../UserContext";
import { LogButtonStyled } from "../Styles/Styles";
import { useHistory } from "react-router-dom";

function LogButton(props) {
  var provider = new firebase.auth.GoogleAuthProvider();
  let { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  let history = useHistory();
  return (
    <LogButtonStyled
      onClick={() => {
        if (isLoggedIn) {
          // WYLOGOWANIE
          firebase
            .auth()
            .signOut()
            .then(() => {
              // Sign-out successful.
              setIsLoggedIn(false);
              history.push("/");
            })
            .catch((error) => {
              alert("Spróbuj jeszcze raz");
              setIsLoggedIn(CheckIfLoggedIn());
            });
        } else {
          // ZALOGOWANIE
          firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
              // /** @type {firebase.auth.OAuthCredential} */
              // var credential_result = result.credential;
              // // This gives you a Google Access Token. You can use it to access the Google API.
              // var token_result = credential_result.accessToken;
              // // The signed-in user info.
              // var user_tmp = result.user;
              setIsLoggedIn(true);
            })
            .catch((error) => {
              setIsLoggedIn(false);
              // // Handle Errors here.
              // var errorCode = error.code;
              // var errorMessage = error.message;
              // // The email of the user's account used.
              // var email = error.email;
              // // The firebase.auth.AuthCredential type that was used.
              // var credential = error.credential;
            });
        }
      }}
    >
      {isLoggedIn === true ? "Wyloguj" : "Zaloguj"}
    </LogButtonStyled>
  );
}

export default LogButton;
