//* Framework Imports
import React, { useRef, useState } from "react";
import firebase from "firebase";

//* Componentes
import {
  TableColumnTitles,
  TableRow,
  TableTitle,
  TableWrapper,
} from "../Styles/Styles";

//* Helpers
import Priv from "../Helpers/Priv";
import { Button, Container, LoadingLayer } from "../Styles/Styles";

function SmallAmount(props) {
  //* States
  const [buttonClicked, setButtonClicked] = useState(false);

  //* Refs
  const loadingLayerRef = useRef(null);

  //* Variables
  const db = firebase.firestore();
  let sortedData = [];
  let [tableJSX, setTableJSX] = useState(null);

  //* Functions
  // Toggle Loading Animation
  const toggleLoading = () => {
    // Shortcut to LoadingLayer style prop
    const ref = loadingLayerRef.current.style;
    if (ref.display === "flex") {
      ref.display = "none";
    } else {
      ref.display = "flex";
    }
  };

  // Download all items data from firestore
  const getItemsInfo = async () => {
    let items = [];
    const query = await db.collection("przedmioty").get();
    query.forEach((item) => {
      items.push(item.data());
    });
    return items;
  };

  // Download data about magazines
  const getMagazinesInfo = async () => {
    let magazines = [];
    const query = await db.collection("magazyny").get();
    query.forEach((magazine) => {
      magazines.push(magazine.data());
    });
    return magazines;
  };

  const generateReport = async () => {
    // Get items data
    let items = await getItemsInfo();

    // Get references to all checked checkboxes parents
    let containers = Array.from(
      document.querySelectorAll("input[type=checkbox]:checked")
    ).map((checkbox) => {
      return checkbox.parentElement;
    });

    // Somewhere to store info about items
    let itemsToBuy = [];
    // Getting info about items to report
    containers.forEach((element) => {
      const comparator = (item) => {
        return item.qr === element.getElementsByTagName("input")[0].name;
      };
      const quantity = element.getElementsByTagName("input")[1].value;
      let itemInfo = items.filter(comparator);

      itemsToBuy.push({ ...itemInfo[0], doKupienia: quantity });
    });

    // TODO w itemsToBuy sa przedmioty do kupienia. [doKupienia] okresla ilosc danej rzeczy do kupienia
    console.log(itemsToBuy);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Nazwa;Numer katalogowy;Ile do zamowienia\r\n`;
    itemsToBuy.forEach((item) => {
      csvContent += `${item.nazwa};${item.qr};${item.doKupienia}\r\n`;
    });
    // window.open(encodeURI(csvContent));

    var link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `zamowienie_${new Date(Date.now()).toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };

  // Sorting items depending on it's amount and location and making JSX Table
  const makeTable = (items, magazines) => {
    let component = [];
    magazines.forEach((magazine) => {
      // filtering items Comparator
      const comparator = (item) => {
        return item.magazyn === magazine.id;
      };

      // filtering "red" items comparator
      const getRed = (item) => {
        return item.ilosc <= item.malaIlosc;
      };

      // filtering "orange" items comparator
      const getOrange = (item) => {
        return item.ilosc <= 2 * item.malaIlosc && item.ilosc > item.malaIlosc;
      };

      let listOfAllItemsInMagazine = items.filter(comparator);

      // List of items which amount is small
      let listOfRedIndicators = listOfAllItemsInMagazine.filter(getRed);

      // List of items which amount will be small
      let listOfOrangeIndicators = listOfAllItemsInMagazine.filter(getOrange);

      // Info for further printing
      sortedData[magazine.id] = [listOfOrangeIndicators, listOfRedIndicators];

      if (listOfRedIndicators.length > 0 || listOfOrangeIndicators.length > 0) {
        // Making Title of a magazine section
        component.push(
          <TableTitle>
            {magazine.ulica} {magazine.blok} {magazine.miasto} (ID:
            {magazine.id})
          </TableTitle>
        );

        // Making titles for columns
        component.push(
          <TableColumnTitles>
            <div>Nazwa</div>
            <div>kod</div>
            <div>ilosc</div>
            <div>mala Ilosc</div>
            <div>🚐</div>
            <div>skąd</div>
            <div>📝</div>
            <div>🔢</div>
          </TableColumnTitles>
        );

        // Listing items with nearly small amount
        listOfOrangeIndicators.forEach((item) => {
          // comparator which search item in other magazines
          const search = (obj) => {
            return obj.qr === item.qr && obj.magazyn !== item.magazyn;
          };
          let list = items.filter(search);
          let max = null;

          // Searching for maxiumum in that list
          if (list.length > 0) {
            max = list.reduce((prev, curr) => {
              return prev.ilosc < curr.ilosc ? curr : prev;
            });
          }

          // Response
          let borrow = {};

          if (max !== null) {
            // Comparator to get magazin id from item.magazyn
            const getNameMagazine = (magazyn) => {
              return magazyn.id === max.magazyn;
            };
            // Filtering to get name of magazine
            let fromMagazineInfo = magazines.filter(getNameMagazine);

            borrow.amount = max.ilosc;
            borrow.from = `${fromMagazineInfo[0].ulica} ${fromMagazineInfo[0].blok} ${fromMagazineInfo[0].miasto}`;
            // id
          } else {
            borrow.amount = "❌";
            borrow.from = "❌";
          }

          component.push(
            <TableRow color="o" id={item.qr}>
              <div>{item.nazwa}</div>
              <div>{item.qr}</div>
              <div>{item.ilosc}</div>
              <div>{item.malaIlosc}</div>

              <div>{borrow.amount}</div>
              <div>{borrow.from}</div>
              <input
                type="checkbox"
                class="checkbox"
                name={item.qr}
                value={item.qr}
              ></input>
              <input type="number" step="0.01"></input>
            </TableRow>
          );
        });

        // Listing items with small amounts
        listOfRedIndicators.forEach((item) => {
          // comparator which search item in other magazines
          const search = (obj) => {
            return obj.qr === item.qr && obj.magazyn !== item.magazyn;
          };
          let list = items.filter(search);
          let max = null;

          // Searching for maxiumum in that list
          if (list.length > 0) {
            max = list.reduce((prev, curr) => {
              return prev.ilosc < curr.ilosc ? curr : prev;
            });
          }

          // Response
          let borrow = {};

          if (max !== null) {
            // Comparator to get magazin id from item.magazyn
            const getNameMagazine = (magazyn) => {
              return magazyn.id === max.magazyn;
            };
            // Filtering to get name of magazine
            let fromMagazineInfo = magazines.filter(getNameMagazine);

            borrow.amount = max.ilosc;
            borrow.from = `${fromMagazineInfo[0].ulica} ${fromMagazineInfo[0].blok} ${fromMagazineInfo[0].miasto}`;
            // id
          } else {
            borrow.amount = "❌";
            borrow.from = "❌";
          }

          component.push(
            <TableRow color="r" id={item.qr}>
              <div>{item.nazwa}</div>
              <div>{item.qr}</div>
              <div>{item.ilosc}</div>
              <div>{item.malaIlosc}</div>

              <div>{borrow.amount}</div>
              <div>{borrow.from}</div>
              <input
                type="checkbox"
                class="checkbox"
                name={item.qr}
                value={item.qr}
              ></input>
              <input type="number" step="0.01"></input>
            </TableRow>
          );
        });
      }
    });
    setTableJSX(<TableWrapper>{component}</TableWrapper>);
  };

  // Button Click Handler
  const clickHandler = async () => {
    setButtonClicked(true);
    toggleLoading();
    let items = await getItemsInfo();
    let magazines = await getMagazinesInfo();
    makeTable(items, magazines);
    toggleLoading();
  };

  return (
    // Private Rendering
    <Priv>
      {/* hidden loading layer */}
      <LoadingLayer ref={loadingLayerRef}>Loading...</LoadingLayer>
      {/* <PopUp></PopUp> */}
      {/* Main Container */}
      <Container orientation="v" width="100%">
        {/* Main Button to download data */}
        {!buttonClicked && (
          <Button
            onClick={() => {
              clickHandler();
            }}
          >
            Sprawdź małe ilości
          </Button>
        )}
        {buttonClicked && (
          <>
            {tableJSX}
            <Button
              onClick={() => {
                generateReport();
              }}
            >
              Pobierz liste
            </Button>
          </>
        )}
      </Container>
    </Priv>
  );
}

export default SmallAmount;
