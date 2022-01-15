import React, { useState, useRef } from "react";
import {
  Button,
  Container,
  Input,
  ScannedTextList,
  colors,
} from "../Styles/Styles";

function SearchBar(props) {
  // Save data provided by props to variable
  const data = props.data;
  // List of a results from serachbar to render beneath input
  const [list, setList] = useState([]);
  // Ref to InputField
  const InputFieldRef = useRef(null);
  // Function to set state at parent
  const setter = props.setter;

  //   Function to set list to object that name match the input from input
  const filterResultList = (inputValue) => {
    // Empty list to have to save matching items to
    let resultList = [];
    // Checking if [inputValue] is a substring of a item name
    data.forEach((item) => {
      if (inputValue !== "" && item.nazwa.includes(inputValue)) {
        //   If length of a list is not exciding 10, append item to the list
        if (list.length < 10) {
          resultList.push(item);
        }
      }
    });

    // Set [list] state variable to list of matched items
    setList(resultList);
  };

  //   Fill inputField with chosen item name from list and clear list after
  const putIntoInputField = (stringToPutIntoInputField) => {
    // Changing the value of a inputField
    InputFieldRef.current.value = stringToPutIntoInputField;
    // Clearing [list] state variable to not display after picking item
    setList([]);
  };

  return (
    <>
      {/* Input to provide text to match item name */}
      <Container
        width="95%"
        orientation="h"
        style={{ border: `0.3rem solid ${colors.n1}`, marginTop: "1rem" }}
      >
        <Input
          style={{ width: "90%", border: "none" }}
          ref={InputFieldRef}
          onChange={(e) => {
            // Updating result list state
            filterResultList(e.target.value);
            setter(e.target.value);
          }}
        ></Input>
        <Button
          style={{
            width: "5%",
            fontSize: "1rem",
            padding: "0",
            border: "none",
          }}
          onClick={() => {
            InputFieldRef.current.value = "";
            setter("");
          }}
        >
          ❌
        </Button>
      </Container>

      {/* Rendering list of results */}
      {list.length !== 0 && (
        <ScannedTextList
          style={{
            width: "90%",
            marginTop: "0",
            border: `0.3rem solid ${colors.n1}`,
            borderTop: "none",
          }}
        >
          {list.map((listItem) => {
            return (
              <li
                style={{ padding: ".2rem .2rem" }}
                onClick={() => {
                  putIntoInputField(listItem.nazwa);
                  setter(listItem.nazwa);
                }}
              >
                <div style={{ gridColumnStart: "1", gridColumnEnd: "3" }}>
                  {listItem.nazwa}
                </div>
                <div style={{ gridColumnStart: "3", gridColumnEnd: "6" }}>
                  {listItem.ilosc}
                </div>
              </li>
            );
          })}
          <Button
            style={{
              height: "fit-content",
              fontSize: "1rem",
              padding: "0",
              border: "none",
            }}
            onClick={() => {
              setList([]);
            }}
          >
            ❌
          </Button>
        </ScannedTextList>
      )}
    </>
  );
}

export default SearchBar;
