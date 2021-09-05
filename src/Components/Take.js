// Frameworks imports
import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase";

// Helpers
import Priv from "../Helpers/Priv";

// Components
import {
  QrReaderStyled,
  Button,
  Container,
  ScannedTextBox,
  ScannedTextList,
  Input,
  EmojiButton,
  PicturePreview,
  LoadingLayer,
} from "../Styles/Styles";

function Take(props) {
  // Classes
  class Item {
    constructor(qr) {
      this.loading = true;
      this.available = null;

      this.qr = qr;
      this.name = null;
      this.category = null;
      this.producer = null;
      this.magazine = null;
      this.count = null;
      this.id = null;
      this.setMetaData().then((result) => {
        this.loading = false;
      });
      this.photoURL = null;
      this.getPhotoURL();
    }

    setMetaData = async () => {
      const db = firebase
        .firestore()
        .collection("przedmioty")
        .where("qr", "==", this.qr)
        .where("magazyn", "==", wybranyMagazyn);
      const query = await db.get();
      if (query.empty) {
        alert("W tym magazynie nie ma takiego przedmiotu");
        this.available = false;
        return false;
      } else {
        query.forEach((doc) => {
          this.available = true;
          const data = doc.data();
          this.count = data.ilosc;
          this.name = data.nazwa;
          this.category = data.kategoria;
          this.producer = data.producent;
          this.magazine = data.magazyn;
          this.id = doc.id;
          return true;
        });
      }
    };

    getPhotoURL = async () => {
      const storageRef = firebase.storage().ref();
      storageRef
        .child(`${this.qr}.png`)
        .getDownloadURL()
        .then((url) => {
          this.photoURL = url;
        })
        .catch((error) => {
          console.log(`Nie ma zdjecia dla ${this.qr}`);
          this.photoURL = null;
        });
    };
  }
  class Row {
    constructor(item, count) {
      this.item = item;
      this.count = count;
    }
  }

  // UseEffect on load. Get Storage names and adresses
  useEffect(() => {
    const getStorageNamesData = async () => {
      const db = firebase.firestore().collection("magazyny");
      const query = await db.get();
      let storageLista = [];

      const storageClickHandler = (id) => {
        setWybranyMagazyn(id);
      };

      query.forEach((magazyn) => {
        const dane = magazyn.data();
        storageLista.push(
          <Button
            key={dane.id}
            onClick={() => {
              storageClickHandler(dane.id);
            }}
          >
            {dane.ulica} {dane.blok} {dane.miasto} {dane.kraj}
          </Button>
        );
      });
      setListaMagazynow(storageLista);
    };
    getStorageNamesData();
  }, []);

  // Refs
  let PicturePreviewRef = useRef(null);
  let LoadingScreenRef = useRef(null);

  // States
  let [listaMagazynow, setListaMagazynow] = useState(null);
  let [wybranyMagazyn, setWybranyMagazyn] = useState(null);
  let [code, setCode] = useState("");
  let [lista, setLista] = useState([]);
  // Confirm Button States
  // 0 - didn't click on confirm
  // 1 - clicked on confirm and need to click again
  // 2 - clicked second time and confirmed
  let [confirm, setConfirm] = useState(0);

  // Confirm Button conditional Texts based on state "confirm"
  const ConfirmButtonText = () => {
    switch (confirm) {
      case 0:
        return "Zabierz rzeczy z listy";
      case 1:
        return "Potwierdź Zabranie";
      case 2:
        return "Realizowanie...";
      default:
        return "Zabierz rzeczy z listy";
    }
  };

  // QR Scanner Handlers
  const onScanHandler = (result) => {
    setCode(result);
  };
  const onErrorHandler = (error) => {
    alert(error);
  };

  // List operations functions
  const getScannedIntoListHandler = async () => {
    if (code === "" || code === null || code === undefined) {
    } else {
      LoadingScreenRef.current.style.display = "flex";
      let tab = lista;
      let item = new Item(code);

      const check = setInterval(() => {
        if (item.loading === true) {
          console.log("Checking");
        } else if (item.loading === false) {
          if (item.available === true) {
            let row = new Row(item, 0);
            tab.push(row);
            setLista(tab);
          }
          LoadingScreenRef.current.style.display = "none";
          clearInterval(check);
        } else {
          console.log("Checking");
        }
      }, 100);
    }
  };
  const deleteItemFromList = (item) => {
    const deleteItem = (itemRef) => {
      return itemRef !== item;
    };

    let newlist = lista;
    console.log(newlist);
    newlist = newlist.filter(deleteItem);
    console.log(newlist);
    setLista(newlist);
    item = null;
  };
  // Show picture of an item from list
  const ItemPhotoHandler = (URL = null) => {
    let ref = PicturePreviewRef.current;
    if (ref.style.display === "none") {
      ref.style.display = "block";
      ref.src = URL;
    } else {
      ref.style.display = "none";
    }
  };
  // Sending info to backend about taken items and log into history
  const sendInfo = async (confirmStatus) => {
    if (confirmStatus === 1) {
      setConfirm(2);
      const db = firebase.firestore().collection("przedmioty");
      const dbHistory = firebase.firestore().collection("historia");
      let errorList = [];
      // Sending info about taken items
      lista.forEach((row) => {
        let decrement = firebase.firestore.FieldValue.increment(-row.count);
        db.doc(row.item.id)
          .update({
            ilosc: decrement,
          })
          .then(() => {
            setConfirm(0);
            // Log into history
            dbHistory
              .add({
                kto: firebase.auth().currentUser.email,
                co: row.item.qr,
                ile: row.count,
                magazyn: row.item.magazine,
                kiedy: firebase.firestore.Timestamp.fromDate(new Date()),
              })
              .then((result) => {
                alert("Dodano wpis w historii");
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            errorList.push(row);
            console.log(error);
            alert("Wystąpił błąd");
            setConfirm(0);
          });
      });

      if (errorList.length === 0) {
        setLista([]);
        alert("Udało się");
        setConfirm(0);
      } else {
        setConfirm(0);
        let notification = "Błędy przy: ";
        errorList.forEach((errorRow) => {
          notification = `${notification} ${errorRow.item.name}`;
        });
        alert(notification);
      }
    }
  };

  return (
    <Priv>
      {/* Loading Screen. Initially [display: none] then flex */}
      <LoadingLayer ref={LoadingScreenRef}>Loading...</LoadingLayer>

      {/* Picture of an item Screen */}
      <PicturePreview
        ref={PicturePreviewRef}
        onClick={() => {
          ItemPhotoHandler();
        }}
        alt="Item Photo"
      ></PicturePreview>

      {/* Main Container with conditional rendering after selecting storage */}
      <Container width="100%" orientation="v">
        {wybranyMagazyn === null ? <h1>Wybierz magazyn</h1> : null}
        {wybranyMagazyn === null ? (
          listaMagazynow
        ) : (
          <>
            {/* QR Reader */}
            <QrReaderStyled
              onScan={onScanHandler}
              onError={onErrorHandler}
              delay={800}
              facingMode={"environment"}
              showViewFinder={true}
            ></QrReaderStyled>

            {/* Box with scanned code */}
            <ScannedTextBox>{code}</ScannedTextBox>

            {/* Button which take scanned code and insert Item into List */}
            <Button
              onClick={() => {
                getScannedIntoListHandler();
              }}
            >
              Weź przedmiot
            </Button>

            {/* UL with scanned items */}
            <ScannedTextList>
              {lista.map((row, index) => {
                return (
                  <li key={index}>
                    <div>{row.item.name}</div>
                    <Input
                      id={index}
                      type="number"
                      placeholder={row.count}
                      max={row.item.count}
                      onChange={() => {
                        let value = document.getElementById(index).value;
                        let newVal = null;
                        if (value >= row.item.count) {
                          newVal = row.item.count;
                        } else {
                          newVal = value;
                        }
                        document.getElementById(index).value = newVal;
                        row.count = newVal;
                      }}
                    />
                    <div> / {row.item.count}</div>
                    <EmojiButton
                      onClick={() => {
                        deleteItemFromList(row);
                      }}
                    >
                      ❌
                    </EmojiButton>
                    <EmojiButton
                      onClick={() => {
                        ItemPhotoHandler(row.item.photoURL);
                      }}
                    >
                      📷
                    </EmojiButton>
                  </li>
                );
              })}
            </ScannedTextList>

            {/* Confirm Button */}
            <Button
              onClick={() => {
                sendInfo(confirm);
                setConfirm((confirm + 1) % 3);
              }}
              styleState={confirm}
            >
              {ConfirmButtonText()}
            </Button>
          </>
        )}
      </Container>
    </Priv>
  );
}

export default Take;
