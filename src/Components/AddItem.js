// Frameworks imports
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase";
import convert from "image-file-resize";

// Components
import { Container, Input, Form, Button } from "../Styles/Styles";

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
      <Container width="100%" orientation="v">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeholder="Nazwa"
            id="name"
            name="name"
            {...register("name")}
          ></Input>

          <Input
            placeholder="Kategoria"
            id="category"
            name="category"
            {...register("category")}
          ></Input>

          <Input
            placeholder="Producent"
            id="producer"
            name="producer"
            {...register("producer")}
          ></Input>

          <Input
            placeholder="Mała Ilość"
            {...register("smallQuantity")}
          ></Input>

          <Input
            placeholder="Numer kat."
            id="qr"
            name="qr"
            {...register("qr")}
          ></Input>

          {listaMagazynow !== null &&
            listaMagazynow.map((magazine) => {
              return (
                <Input
                  {...register(`mag.${magazine.id}`)}
                  key={magazine.id}
                  placeholder={`Magazyn ${magazine.ulica} ${magazine.blok} ilość`}
                ></Input>
              );
            })}

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
              // let canv = photoRef.current;
              // let ctx = canv.getContext("2d");
              // let img = new Image();

              // img.onload = () => {
              //   let ratio = Math.min(
              //     thumbnailSize[0] / img.naturalWidth,
              //     thumbnailSize[1] / img.naturalHeight
              //   );
              //   ctx.drawImage(
              //     img,
              //     canv.width / 2 - (img.naturalWidth * ratio) / 2,
              //     canv.height / 2 - (img.naturalHeight * ratio) / 2,
              //     img.naturalWidth * ratio,
              //     img.naturalHeight * ratio
              //   );
              // };

              // img.src = URL.createObjectURL(file);
              // setTimeout(() => {
              //   canv.toBlob((blob) => {
              //     setPhoto(blob);
              //   }, "image/jpg");
              // }, 1000);
            }}
          />

          <Button type="submit">Dodaj</Button>
        </Form>
      </Container>
    </Priv>
  );
}

export default AddItem;
