// Frameworks imports
import React, { useState } from "react";
import firebase from "firebase";
import convert from "image-file-resize";
import Button from '@mui/material/Button';

// Helpers
import Priv from "../Helpers/Priv";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Stack } from "@mui/system";
import { TextField } from "@mui/material";

function AddItem(props) {
  const [photo, setPhoto] = useState(null);
  
  const [photoURL, setPhotoURL] = useState("#");
  const [unit, setUnit] = useState("sztuka")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("kanalizacja")
  const [provider, setProvider] = useState("")
  const [smallAmount, setSmallAmount] = useState(5)
  const [packageSize, setPackageSize] = useState(1)
  const [qr, setQr] = useState("")

  // Width, Height
  let thumbnailSize = [280, 500];

  const handleSubmit = async () => {
    var storageRef = firebase.storage().ref().child(`${qr}`);
    storageRef.put(photo)
    var db = firebase.firestore();

    const item = {
      id: qr,
      name,
      category,
      provider,
      smallAmount,
      packageSize,
      unit,
    }

    db.collection("przedmioty").add(item).then(r=>alert("Dodano przedmiot do bazy danych"))
  };

  return (
    <Priv>
        <Stack gap={3} sx={{width:"60%", margin:"0 auto"}}>
        
        {/* Name */}
        <TextField 
        fullwidth
        id="name" 
        label="Nazwa" 
        variant="standard"
        value={name}
        onChange={(e)=>{setName(e.target.value)}}
        />

        {/* Category */}
        <FormControl>
          <InputLabel id="category-select-label">Kategoria</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Kategoria"
            onChange={(e)=>{setCategory(e.target.value);}}
          >
            <MenuItem value={"kanalizacja"}>Kanalizacja</MenuItem>
            <MenuItem value={"wyslij"}>wyslij mi na whatsappie wiecej kategorii</MenuItem>
          </Select>
        </FormControl>

          {/* Provider */}
          <TextField 
          fullwidth
          id="provider" 
          label="Dostawca" 
          variant="standard"
          value={provider}
          onChange={(e)=>{setProvider(e.target.value)}}
          />

          {/* Small amount */}
          <TextField 
          fullwidth
          id="smallAmount" 
          label="Mała ilość" 
          variant="standard"
          type="number"
          value={smallAmount}
          onChange={(e)=>{setSmallAmount(e.target.value)}}
          />

          {/* Package size */}
          <TextField 
          fullwidth
          id="packageSize" 
          label="Ile w opakowaniu" 
          variant="standard"
          type="number"
          value={packageSize}
          onChange={(e)=>{setPackageSize(e.target.value)}}
          />

        <FormControl>
          <InputLabel id="unit-select-label">Jednostka miary</InputLabel>
          <Select
            labelId="unit-select-label"
            id="unit-select"
            value={unit}
            label="Jednostka"
            onChange={(e)=>{setUnit(e.target.value);}}
          >
            <MenuItem value={"sztuka"}>Sztuka</MenuItem>
            <MenuItem value={"opakowanie"}>Opakowanie</MenuItem>
            <MenuItem value={"metr"}>Metr</MenuItem>
            <MenuItem value={"paleta"}>Paleta</MenuItem>
            <MenuItem value={"worek"}>Worek</MenuItem>
            <MenuItem value={"litr"}>Litr</MenuItem>
          </Select>
        </FormControl>


          {/* QR */}
          <TextField 
          fullwidth
          id="qr" 
          label="qr | numer katalogowy (unikalny)" 
          variant="standard"
          value={qr}
          onChange={(e)=>{setQr(e.target.value)}}
          />

          {photoURL !== "#" && <img src={photoURL} alt="item"></img>}

          <input
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
                  // const reader = new FileReader();

                  setPhoto(resp);
                  setPhotoURL(URL.createObjectURL(resp));
                })
                .catch((error) => {
                  alert(error);
                });
            }}
          />

            <Button 
            variant="outlined" 
            sx={{padding:"2rem"}}
            onClick={handleSubmit}
            >Dodaj</Button>
          </Stack>
    </Priv>
  );
}

export default AddItem;
