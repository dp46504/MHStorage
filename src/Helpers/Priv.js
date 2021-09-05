// Frameworks imports
import React, { useContext } from "react";

// Helpers
import UserContext from "../UserContext";

function Priv(props) {
  let { currentUser } = useContext(UserContext);

  // If logged, show all childrens of this component. Otherwise null is returned
  return <>{currentUser !== null ? props.children : null}</>;
}

export default Priv;
