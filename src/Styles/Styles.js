import styled, { createGlobalStyle } from "styled-components";
import { NavLink as navln } from "react-router-dom";

export const GlobalStyle = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
    background-color: red;
}
*{
    box-sizing: border-box;
}
`;

// eslint-disable-next-line
const colors = {
  n1: "#121D26",
  n2: "#025E73",
  n3: "#026773",
  n4: "#0396A6",
  n5: "#F2EDE4",
};

export const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100px")};
  height: ${(props) => (props.height ? props.height : "100px")};
  display: flex;
  flex-direction: ${(props) => (props.orientation === "h" ? "row" : "column")};
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`;
export const Link = styled(navln)`
  font-family: Arial;
  font-weight: bold;
  font-size: 2rem;
  text-decoration: none;
  padding: 0.5rem;
  color: ${colors.n2};
  border: 0.3rem dashed ${colors.n2};
  &.active {
    border: 0.3rem solid ${colors.n2};
  }
`;
