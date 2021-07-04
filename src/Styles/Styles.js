import styled, { createGlobalStyle } from "styled-components";
import { NavLink as navln } from "react-router-dom";

export const GlobalStyle = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
}
*{
    box-sizing: border-box;
    font-family: Helvetica, sans-serif;
}
`;

const colors = {
  // n1: "#121D26",
  // n2: "#025E73",
  // n3: "#026773",
  // n4: "#0396A6",
  // n5: "#F2EDE4",

  n1: "#2C6655",
  n2: "#327561",
  n3: "#358768",
  n4: "#419D6D",
  n5: "#4EB06F",
};

export const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100px")};
  height: fit-content;
  display: flex;
  flex-direction: ${(props) => (props.orientation === "h" ? "row" : "column")};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
export const Link = styled(navln)`
  font-family: Arial;
  font-weight: bold;
  font-size: 2rem;
  text-decoration: none;
  text-align: center;
  padding: 0.5rem;
  margin: 0.25rem;
  flex: 1 1 15%;
  color: ${colors.n3};
  mix-blend-mode: color-burn;
  border: 0.3rem dashed ${colors.n3};
  &.active {
    border: 0.3rem solid ${colors.n4};
    color: ${colors.n4};
  }
`;

export const LogButtonStyled = styled.button`
  font-family: Arial;
  font-weight: bold;
  font-size: 2rem;
  text-decoration: none;
  text-align: center;
  padding: 0.5rem;
  margin: 0.25rem;
  flex: 0 1 7%;
  color: ${colors.n1};
  border: 0.3rem solid ${colors.n1};
  mix-blend-mode: color-burn;
  cursor: pointer;
`;
