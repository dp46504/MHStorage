import styled, { createGlobalStyle, keyframes } from "styled-components";
import { NavLink as navln } from "react-router-dom";
import QrReader from "react-qr-reader";

export const GlobalStyle = createGlobalStyle`
body{
    margin: 0;
    padding: 0;
}
*{
    box-sizing: border-box;
    font-family: Helvetica, sans-serif;
}

@media screen and (max-width:400px){
  html, body{
    font-size: 13px;
  }
}
`;

export const colors = {
  // n1: "#121D26",
  // n2: "#025E73",
  // n3: "#026773",
  // n4: "#0396A6",
  // n5: "#ADEBFE",

  n1: "#2C6655",
  n2: "#327561",
  n3: "#358768",
  n4: "#419D6D",
  n5: "#4EB06F",
  danger: "#AA5959",
  danger2: "#DE5959",
  orange: "#e0aa07",
  red: "#ab2b37",
};

export const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100px")};
  height: fit-content;
  display: flex;
  flex-direction: ${(props) => (props.orientation === "h" ? "row" : "column")};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
  text-align: center;
`;

export const QrReaderStyled = styled(QrReader)`
  width: 50%;
  height: auto;
`;

export const Link = styled(navln)`
  font-family: Arial;
  font-weight: bold;
  font-size: 2rem;
  text-decoration: none;
  text-align: center;
  position: relative;
  padding: 0.5rem;
  margin: 0.25rem;
  flex: 1 1 15%;
  color: ${colors.n3};
  transition: all 500ms;

  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 0.4rem;
    bottom: 0;
    left: 0;
    background-color: ${colors.n1};
    transition: all 500ms;
  }

  &.active {
    &:before {
      height: 100%;
      background-image: linear-gradient(to top, ${colors.n1}, ${colors.n4});
      opacity: 0.5;
    }
    color: black;
    text-shadow: 0.5rem 0.5rem 1rem ${colors.n1};
  }

  &:hover {
    transform: translateY(-0.4rem);
    color: ${colors.n1};
    text-shadow: 0.5rem 0.5rem 1rem ${colors.n1};
  }
`;

export const Button = styled.button`
  width: 95%;
  height: fit-content;
  position: relative;
  padding: 1rem;
  margin: 0.5rem 0.1rem;

  border: 0.3rem solid
    ${(props) => {
      switch (props.styleState) {
        case 0:
          return colors.n2;
        case 1:
          return colors.danger;
        case 2:
          return colors.n5;
        default:
          return colors.n2;
      }
    }};
  color: ${(props) => {
    switch (props.styleState) {
      case 0:
        return colors.n2;
      case 1:
        return colors.danger;
      case 2:
        return colors.n5;
      default:
        return colors.n2;
    }
  }};
  background-color: transparent;
  font-size: ${(props) => {
    switch (props.styleState) {
      case 0:
        return "1.3rem";
      case 1:
        return "2rem";
      case 2:
        return "1.3rem";
      default:
        return "1.3rem";
    }
  }};
  font-weight: bold;
  transition: transform 150ms;
  &:active {
    transform: scale(1.1);
  }
`;

export const ScannedTextBox = styled.div`
  width: 95%;
  height: fit-content;
  padding: 1rem;
  margin: 0.5rem 0.1rem;
  border: 0.3rem solid
    ${(props) => {
      switch (props.children) {
        case null:
          return colors.n4;
        default:
          return colors.danger2;
      }
    }};
  color: ${(props) => {
    switch (props.children) {
      case null:
        return colors.n4;
      default:
        return colors.danger2;
    }
  }};
  background-color: transparent;
  font-size: 1.3rem;
  font-weight: bold;
`;

export const Label = styled.label`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & *:not(Label) {
    margin-bottom: 1rem;
  }

  & Input {
    border: none;
    border-bottom: 0.2rem solid ${colors.n4};
  }
`;

export const Input = styled.input`
  width: 90%;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  position: relative;
  border: none;
  border-bottom: 0.2rem solid ${colors.n4};
  transition: transform 500ms;
  margin: 0.3rem;
  &::placeholder {
    transition: transform 500ms;
  }

  &:focus {
    outline: none;
    border: 0.3rem solid ${colors.n5};
    transform: scale(1.05);

    &::placeholder {
      transform: translateX(-30%) scale(0.7);
    }
  }
`;

export const ScannedTextList = styled.ul`
  width: 95%;
  height: fit-content;
  padding: 0;
  margin: 0.5rem 0.1rem;
  border: 0.3rem solid ${colors.n2};
  background-color: transparent;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 fit-content;

  & li {
    width: 100%;
    list-style-type: none;
    text-align: center;
    display: grid;
    grid-template-columns: 5fr 2fr 3fr 1fr 1fr;
    padding: 0.5rem 0.5rem;
    background-color: ${colors.n5};
    overflow-x: visible;
  }
  & li:nth-child(n):not(:last-child) {
    border-bottom: 0.1rem solid black;
  }

  /* & li:first-child {
    font-size: 1rem;
  } */

  & li * {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
  }

  & li ${Input} {
    background-color: ${colors.n4};
    border: none;
  }
  & li ${Input}::placeholder {
    color: black;
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
  flex: 1 0 100%;
  color: ${colors.danger};
  border: none;
  opacity: 0.5;

  cursor: pointer;
  background-color: transparent;
  position: relative;
  transition: all 500ms;

  &:hover {
    &:before {
      height: 100%;
      mix-blend-mode: color-dodge;
      background-color: ${colors.danger2};
    }
    color: white;
    opacity: 1;
  }

  &:before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 0.4rem;
    bottom: 0;
    left: 0;
    background-color: ${colors.danger};
    transition: all 500ms;
  }
`;

export const EmojiButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
`;

export const PicturePreview = styled.img`
  width: 60vw;
  height: 90vw;
  z-index: 101;
  position: fixed;
  top: calc(50% - 45vw);
  left: calc(50% - 30vw);
  border: 0.3rem solid ${colors.n2};

  display: none;
  background-color: transparent;
`;

const pulseAnim = keyframes`
0%{
transform: translateY(-1rem);
}
100%{
  transform: translateY(0rem);
}
`;

export const LoadingLayer = styled.div`
  width: 20rem;
  padding: 0 5rem;
  height: 20vw;
  top: calc(50% - 10vw);
  left: calc(50% - 10rem);
  z-index: 200;
  position: fixed;
  background-color: black;
  opacity: 0.8;
  color: white;
  display: none;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  animation: ${pulseAnim} 1000ms infinite cubic-bezier(0.36, 1.02, 0.41, -0.5)
    alternate;
  border-radius: 2rem;
  border: 0.5rem dotted ${colors.n2};
`;

export const TableTitle = styled.div`
  width: 100%;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  &:not(:first-of-type) {
    border-top: 0.3rem solid black;
  }
`;

export const TableColumnTitles = styled.div`
  width: 100%;
  display: grid;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  font-weight: bold;
  place-items: center;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
  font-size: 0.9rem;
`;

export const TableWrapper = styled.div`
  width: 100%;
  height: fit-content;
`;

export const TableRow = styled.div`
  width: 100%;
  display: grid;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  font-size: 1rem;

  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 1fr 0.3fr;
  place-items: center;
  background-color: ${(props) => {
    if (props.color === "o") {
      return colors.orange;
    } else {
      return colors.red;
    }
  }};

  & input[type="number"] {
    max-width: 2rem;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      display: none;
    }
  }
`;

export const PopUpWindow = styled.div`
  position: fixed;
  width: 65%;
  height: fit-content;

  top: auto;
  left: auto;

  z-index: 300;
  padding: 0.3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &:before {
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0.8;
  }
`;
