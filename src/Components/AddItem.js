// Frameworks imports
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase";
import convert from "image-file-resize";

// Components
import { Container, Input, Form, Button, Label } from "../Styles/Styles";

// Helpers
import Priv from "../Helpers/Priv";

function AddItem(props) {
  const { register, handleSubmit } = useForm();
  let [listaMagazynow, setListaMagazynow] = useState(null);
  let [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("#");

  // Width, Height
  let thumbnailSize = [280, 500];

  useEffect(() => {
    let storageLista = [];

    const getMagazineData = async () => {
      const db = firebase.firestore().collection("magazyny");
      const query = await db.get();
      query.forEach((doc) => {
        const data = doc.data();
        storageLista.push(data);
      });
    };
    getMagazineData().then((res) => {
      setListaMagazynow(storageLista);
    });
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    var storageRef = firebase.storage().ref().child(`${data.qr}`);
    storageRef.put(photo).then(() => {
      alert("Uploaded photo");
    });
    var db = firebase.firestore();

    let item = {
      kategoria: data.category,
      magazyn: null,
      ilosc: null,
      malaIlosc: parseInt(data.smallQuantity),
      nazwa: data.name,
      producent: data.producer,
      qr: data.qr,
      cena: parseFloat(data.price),
    };

    data.mag.forEach((quantity, index) => {
      if (quantity !== "") {
        item.magazyn = parseInt(index);
        item.ilosc = parseInt(quantity);
        db.collection("przedmioty").add(item);
      }
    });
  };

  return (
    <Priv>
      <Container width="90%" orientation="v">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Label for="name">Nazwa ⬇️</Label>
          <Input
            placeholder="Nazwa"
            id="name"
            name="name"
            {...register("name")}
          ></Input>

          <Label for="category">Kategoria ⬇️</Label>
          <Input
            placeholder="Kategoria"
            id="category"
            name="category"
            {...register("category")}
          ></Input>

          <Label for="producer">Producent ⬇️</Label>
          <Input
            placeholder="Producent"
            id="producer"
            name="producer"
            {...register("producer")}
          ></Input>

          <Label for="small">Mała ilość ⬇️</Label>
          <Input
            id="small"
            placeholder="Mała Ilość"
            {...register("smallQuantity")}
          ></Input>

          <Label for="qr">QR ⬇️</Label>
          <Input
            placeholder="Numer kat."
            id="qr"
            name="qr"
            {...register("qr")}
          ></Input>

          {listaMagazynow !== null &&
            listaMagazynow.map((magazine) => {
              return (
                <>
                  <Label for={magazine.id}>
                    Ilosc w magazynie: {magazine.ulica} {magazine.blok} ⬇️
                  </Label>
                  <Input
                    {...register(`mag.${magazine.id}`)}
                    id={magazine.id}
                    key={magazine.id}
                    placeholder={`Magazyn ${magazine.ulica} ${magazine.blok} ilość`}
                  ></Input>
                </>
              );
            })}

          <Label for="price">Cena ⬇️</Label>
          <Input
            {...register("price")}
            id="price"
            type="number"
            placeholder="Cena"
            step="0.01"
          ></Input>
          <img src={photoURL} alt="item"></img>

          <Input
            {...register("photo", { required: "Musisz dodać zdjęcie" })}
            type="file"
            id="photo"
            name="photo"
            accept="image/jpg, image/jpeg"
            capture={true}
            onChange={(e) => {
              let file = e.target.files[0];
              convert({
                file: file,
                width: thumbnailSize[0],
                height: thumbnailSize[1],
                type: "jpeg",
              })
                .then((resp) => {
                  const reader = new FileReader();

                  setPhoto(resp);
                  setPhotoURL(URL.createObjectURL(resp));
                })
                .catch((error) => {
                  alert(error);
                });
            }}
          />

          <Button type="submit">Dodaj</Button>
        </Form>
      </Container>
    </Priv>
  );
}

export default AddItem;
