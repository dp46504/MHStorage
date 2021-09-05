// Frameworks imports
import React, { useContext } from "react";

// Helpers
import UserContext from "../UserContext";

// Components
import { Container } from "../Styles/Styles";

function Home(props) {
  let { currentUser } = useContext(UserContext);

  return (
    <Container width="100%" height="fit-content" orientation="h">
      <h1>
        {currentUser !== null ? "Wybierz co chcesz zrobić" : "Zaloguj się"}
      </h1>
    </Container>
  );
}

export default Home;
