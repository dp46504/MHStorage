import React, { useContext } from "react";
import firebase from "firebase";
import UserContext from "../UserContext";
import { LogButtonStyled } from "../Styles/Styles";

function LogButton(props) {
  var provider = new firebase.auth.GoogleAuthProvider();
  let { currentUser } = useContext(UserContext);
  return (
    <LogButtonStyled
      onClick={() => {
        if (currentUser !== null) {
          // WYLOGOWANIE
          firebase
            .auth()
            .signOut()
            .then(() => {
              // Sign-out successful.
              console.log("Logged out");
            })
            .catch((error) => {
              alert("ERROR");
            });
        } else {
          // ZALOGOWANIE
          firebase
            .auth()
            .signInWithRedirect(provider)
            .then((result) => {
              console.log("Logged in");
            })
            .catch((error) => {
              alert("You can't log in. Contact 696 813 813");
              alert(error);
            });
        }
      }}
    >
      {currentUser !== null ? "Wyloguj" : "Zaloguj"}
    </LogButtonStyled>
  );
}

export default LogButton;
