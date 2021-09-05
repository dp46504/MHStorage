// Frameworks imports
import { Container, GlobalStyle, Link } from "./Styles/Styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase";

// Helpers
import UserContext from "./UserContext";
import Priv from "./Helpers/Priv";

// Components
import Home from "./Components/Home";
import Storage from "./Components/Storage";
import Take from "./Components/Take";
import LogButton from "./Components/LogButton";
import Give from "./Components/Give";

function App() {
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log(`Change to ${user === null ? "OUT" : "IN"}`);
    });

    return unsubscribe;
  }, []);

  let [currentUser, setCurrentUser] = useState(null);
  let [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={{ currentUser, loading }}>
      <GlobalStyle></GlobalStyle>

      <Router>
        {/* Menu */}
        <Container width="100%" height="8rem" orientation="h">
          {/* Conditional render of menu */}
          <Priv>
            <Link to="/take">Zabierz</Link>
            <Link to="/give">Odłóż</Link>
            <Link to="/storage">Stan</Link>
            <Link to="/report">Raport</Link>
          </Priv>
          <LogButton></LogButton>
        </Container>

        {/* Routes */}
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/storage" exact component={Storage}></Route>
          <Route path="/take" exact component={Take}></Route>
          <Route path="/give" exact component={Give}></Route>
        </Switch>
        {/* End of Routes */}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
