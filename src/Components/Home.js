// Frameworks imports
import React, { useContext } from "react";

// Helpers
import UserContext from "../UserContext";

// Components
// eslint-disable-next-line
import Reader from "./Reader";
import { Container } from "../Styles/Styles";

function Home(props) {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Container width="100%" height="fit-content" orientation="h">
      <h1>
        {isLoggedIn === true ? "Wybierz co chcesz zrobić" : "Zaloguj się"}
      </h1>
    </Container>
  );
}

export default Home;
