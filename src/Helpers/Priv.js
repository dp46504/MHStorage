// Frameworks imports
import { useHistory } from "react-router-dom";
import React from "react";

function Priv(props) {
  let history = useHistory();

  // Localstorage content of "logged" is operated by firebase login state listener
  if (
    localStorage.getItem("logged") === false ||
    localStorage.getItem("logged") === null
  ) {
    // Redirect to "home" page
    history.push("/");
  }

  // If logged, show all childrens of this component
  return <>{props.children}</>;
}

export default Priv;
