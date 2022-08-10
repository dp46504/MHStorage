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
import AddItem from "./Components/AddItem";
import SmallAmount from "./Components/SmallAmount";
import Construction from './Components/Construction'
import ListOfItemsInDb from "./Components/ListOfItemsInDb";

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
          <LogButton></LogButton>
          <Priv>
            <Link to="/take">Zabierz</Link>
            <Link to="/give">Odłóż</Link>
            <Link to="/storage">Stan</Link>
            <Link to="/itemsindb">Przemioty w bazie danych</Link>
            <Link to="/constructions">Budowy</Link>
            <Link to="/additem">+</Link>
            <Link to="/smallamount">Restock</Link>
          </Priv>
        </Container>

        {/* Routes */}
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/storage" exact component={Storage}></Route>
          <Route path="/take" exact component={Take}></Route>
          <Route path="/give" exact component={Give}></Route>
          <Route path="/constructions" exact component={Construction}></Route>
          <Route path="/smallamount" exact component={SmallAmount}></Route>
          <Route path="/additem" exact component={AddItem}></Route>
          <Route path="/itemsindb" exact component={ListOfItemsInDb}></Route>
        </Switch>
        {/* End of Routes */}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
