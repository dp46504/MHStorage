// Frameworks imports
import React from "react";
import firebase from "firebase";

// Helpers
import Priv from "../Helpers/Priv";

// Components

function Storage(props) {
  return (
    <Priv>
      <h1>TODO: Stan Magazynu</h1>
      {firebase.auth().currentUser.displayName}
    </Priv>
  );
}

export default Storage;
