import { Container, GlobalStyle, Link } from "./Styles/Styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Storage from "./Components/Storage";

function App() {
  return (
    <div>
      <GlobalStyle></GlobalStyle>

      <Router>
        {/* Menu */}
        <Container width="100%" height="8rem" orientation="h">
          <Link to="/storage">Storage</Link>
        </Container>
        {/* Routes */}
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/storage" exact component={Storage}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
