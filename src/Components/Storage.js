// Frameworks imports
import React, { useEffect, useState } from "react";
import firebase from "firebase";

// Helpers
import Priv from "../Helpers/Priv";
import { Container, Button } from "../Styles/Styles";

// Components
import DataTable from "react-data-table-component";

// Variables
import { colors } from "../Styles/Styles";

function Storage(props) {
  let [listaMagazynow, setListaMagazynow] = useState(null);
  let [wybranyMagazyn, setWybranyMagazyn] = useState(null);
  let [listaPrzedmiotow, setListaPrzedmiotow] = useState(null);

  useEffect(() => {
    const getStorageNamesData = async () => {
      const db = firebase.firestore().collection("magazyny");
      const query = await db.get();
      let lista = [];

      const storageClickHandler = (id) => {
        setWybranyMagazyn(id);
      };

      query.forEach((magazyn) => {
        const dane = magazyn.data();
        lista.push(
          <Button
            onClick={() => {
              storageClickHandler(dane.id);
            }}
          >
            {dane.ulica} {dane.blok} {dane.miasto} {dane.kraj}
          </Button>
        );
      });
      setListaMagazynow(lista);
    };
    getStorageNamesData();
  }, []);

  useEffect(() => {
    const getStorageProducts = async () => {
      const db = firebase
        .firestore()
        .collection("przedmioty")
        .where("magazyn", "==", wybranyMagazyn);
      const query = await db.get();
      let lista = [];

      query.forEach((przedmiot) => {
        const dane = przedmiot.data();
        // console.log(dane.nazwa);
        lista.push({
          Nazwa: dane.nazwa,
          Producent: dane.producent,
          Kategoria: dane.kategoria,
          Ilosc: dane.ilosc,
        });
      });

      setListaPrzedmiotow(lista);
    };
    getStorageProducts();
  }, [wybranyMagazyn]);

  const columns = [
    {
      name: "Nazwa",
      selector: "Nazwa",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Prod",
      selector: "Producent",
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: "Kat",
      selector: "Kategoria",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Ilosc",
      selector: "Ilosc",
      sortable: true,
      grow: 1,
      wrap: true,
      center: true,
    },
  ];
  const customStyles = {
    table: {
      style: {
        maxWidth: "1500px",
        margin: "0 auto",
      },
    },
    cells: {
      style: {
        fontSize: "1.3rem",
        backgroundColor: colors.n4,
        padding: "0.5rem",
      },
    },
    headCells: {
      style: {
        fontSize: "1rem",
        backgroundColor: colors.n1,
        color: "white",
      },
      activeSortStyle: {
        color: colors.n5,
      },
    },
  };
  return (
    <Priv>
      <Container width="100%" orientation="v">
        {wybranyMagazyn === null ? <h1>Wybierz magazyn</h1> : null}
        {wybranyMagazyn === null ? listaMagazynow : null}
        {wybranyMagazyn !== null ? (
          <DataTable
            title={`Przedmioty z magazynu nr ${wybranyMagazyn}`}
            customStyles={customStyles}
            columns={columns}
            responsive={true}
            data={listaPrzedmiotow}
          />
        ) : null}
      </Container>
    </Priv>
  );
}

export default Storage;
