// Frameworks imports
import { Container, GlobalStyle, Link } from "./Styles/Styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";
import firebase from "firebase";

// Helpers
import UserContext from "./UserContext";
import CheckIfLoggedIn from "./Helpers/CheckIfLoggedIn";

// Components
import Home from "./Components/Home";
import Storage from "./Components/Storage";
import LogButton from "./Components/LogButton";

function App() {
  // Setting ref to db
  var db = firebase.firestore();

  // Initial value depend on localstorage content
  let [isLoggedIn, setIsLoggedIn] = useState(CheckIfLoggedIn());

  // Listener to login or logout
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem("logged", true);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("logged", false);
      setIsLoggedIn(false);
    }
  });

  return (
    // Passing content with isLoggedIn state with his setter and ref to db
    <UserContext.Provider value={{ db, isLoggedIn, setIsLoggedIn }}>
      <GlobalStyle></GlobalStyle>

      <Router>
        {/* Menu */}
        <Container width="100%" height="8rem" orientation="h">
          {/* Conditional render of menu */}
          {isLoggedIn === true ? (
            <>
              <Link to="/take">Zabierz</Link>
              <Link to="/give">Odłóż</Link>
              <Link to="/storage">Stan</Link>
              <Link to="/report">Raport</Link>
            </>
          ) : null}
          <LogButton></LogButton>
        </Container>

        {/* Routes */}
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/storage" exact component={Storage}></Route>
        </Switch>
        {/* End of Routes */}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
