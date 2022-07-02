import React, {useState, useEffect, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import firebase from "firebase";

// Helpers
import Priv from "../Helpers/Priv";
import SearchBox from "../Helpers/SearchBar";

// Components
import {
    Button,
    Container,
    ScannedTextList,
    Input,
    EmojiButton,
    PicturePreview,
    LoadingLayer,
    Label,
  } from "../Styles/Styles";

function Construction(props){
 // Classes
 class Item {
    constructor(qr, dataAlreadyDownloaded = false, data = null) {
      this.loading = true;
      // If there is already data that means the item is in that storage
      this.available = data === null ? null : true;

      // If data not provided set all to null and then request to databse
      this.qr = qr;
      this.name = data === null ? null : data.nazwa;
      this.category = data === null ? null : data.kategoria;
      this.producer = data === null ? null : data.producent;
      this.magazine = data === null ? null : data.magazyn;
      this.count = data === null ? null : data.ilosc;
      this.id = data === null ? null : data.id;

      // If data not provided request data from database. set loading to be over otherwise because data is already assigned
      if (data === null) {
        this.setMetaData().then((result) => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }

      this.photoURL = null;
      this.getPhotoURL();
    }

    setMetaData = async () => {
      const db = firebase
        .firestore()
        .collection("przedmioty")
        .where("qr", "==", this.qr)
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
        .child(`${this.qr}`)
        .getDownloadURL()
        .then((url) => {
          this.photoURL = url;
        })
        .catch((error) => {
          console.log(`Nie ma zdjecia dla ${this.qr}\n`, error);
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

    let history = useHistory ();

    // 0 - Show constructions lists
    // 1 - Create construction list
    const [choice, setChoice] = useState(null)
    const [items, setItems] = useState([]);
    const [workplacesList, setWorkplacesList]=useState([]);
    const [workplace, setWorkplace] = useState("")
    const [activeWorkplace, setActiveWorkplace] = useState(null)
    const [activeWorkplaceItems, setActiveWorkplaceItems] = useState(null)
    const [code, setCode] = useState("");
    const [lista, setLista] = useState([]);


    let LoadingScreenRef = useRef(null);
    let PicturePreviewRef = useRef(null);



 // QR Scanner Handlers
 const onScanHandler = (result) => {
    setCode(result);
  };
  const onErrorHandler = (error) => {
    alert(error);
  };

  // List operations functions
  const getScannedIntoListHandler = async (manual = false) => {
    if (code === "" || code === null || code === undefined) {
    } else {
      LoadingScreenRef.current.style.display = "flex";
      let tab = lista;

      let item = null;

      if (manual) {
        const comparator = (item) => {
          return item.nazwa === code;
        };
        let found = items.filter(comparator);
        if (found.length !== 0) {
          item = new Item(found[0].qr, true, found[0]);
        } else {
          return alert("Nie ma przedmiotu o takiej nazwie");
        }
      } else {
        item = new Item(code);
      }

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

    // Download all items to help input their names. On 'choice' set to 1
  useEffect(() => {
    // If choice === 1 download items
    if (choice === 1) {
      const getItems = async () => {
        const itemsRef = firebase
          .firestore()
          .collection("przedmioty");
        const items = await itemsRef.get();
        let itemsArray = [];
        items.forEach((item) => {
          itemsArray.push({ ...item.data(), id: item.id });
        });
  
        setItems(itemsArray);
      };

      getItems();
    }else if(choice === 0 ){ //If choice === 0 download workplaces
      const getWorkplaces = async () => {
        const itemsRef = firebase
          .firestore()
          .collection("budowy");
        const workplaces = await itemsRef.get();
        let workplacesArray = [];
        workplaces.forEach((workplc) => {
          workplacesArray.push({ ...workplc.data(), id: workplc.id });
        });
  
        setWorkplacesList(workplacesArray);
      };
      
      getWorkplaces();
    }
  }, [choice]);

// Download items from active workplace
useEffect(() => {
  if(activeWorkplace===null)return null
  const getItems=async()=>{
    let activeWorkplaceItemsList=[]
    
    activeWorkplace.przedmioty.forEach(async(przedmiot)=>{
      const itemRef = firebase
          .firestore()
          .collection("przedmioty").where("qr", "==", przedmiot.qr)
      const item=await itemRef.get()
      item.forEach(itemInfo=>{
        activeWorkplaceItemsList.push({...itemInfo.data(), id:itemInfo.id})

      })
    })

    setActiveWorkplaceItems(activeWorkplaceItemsList)
  }

  getItems()

},[activeWorkplace])

  const saveList=()=>{
    if(workplace==="")return alert("Dodaj nazwe budowy")
    if(lista.length===0)return alert("Lista jest pusta")
    var db = firebase.firestore();
    let list={
        budowa:workplace,
        kto:firebase.auth().currentUser.email,
        kiedy:firebase.firestore.Timestamp.fromDate(new Date()),
        przedmioty:lista.map((row)=>{
            return {
                qr:row.item.qr,
                count:row.count
            }
        })
    }

    db.collection("budowy").add(list).then(
        alert('Lista budowy dodana')
       , history.push('/')
    ).catch(error=>{alert(error)})
  }

// Main Container
return <Priv><Container width="100%" orientation="v">

<LoadingLayer ref={LoadingScreenRef}>Loading...</LoadingLayer>
 {/* Picture of an item Screen */}
 <PicturePreview
        ref={PicturePreviewRef}
        onClick={() => {
          ItemPhotoHandler();
        }}
        alt="Item Photo"
      ></PicturePreview>

    {/* Show/Create List Choice */}
    {choice === null && <>
    <h1>Wybierz opcję</h1>
    <Button onClick={()=>{setChoice(0)}}>Pokaż budowę</Button>
    <Button onClick={()=>{setChoice(1)}}>Stwórz listę budowy</Button>
    </>}

    {/* If Creating List was the choice */}
    {choice===1 && items.length!==0 && <>
    {/* Workplace name input */}
    <Label for="workplace">Nazwa budowy ⬇️</Label>
              <Input
                id="workplace"
                value={workplace}
                onChange={(e) => {
                  setWorkplace(e.target.value);
                }}
              ></Input>

              <SearchBox
                setter={(data) => {
                  setCode(data);
                }}
                data={items}
              ></SearchBox>
              {/* Button which take scanned code and insert Item into List */}
              <Button
                onClick={() => {
                  getScannedIntoListHandler(true);
                }}
              >
                Weź przedmiot
              </Button>
              {lista.length !== 0 && (
                <ScannedTextList>
                  {lista.map((row, index) => {
                    return (
                      <li key={index}>
                        <div>{row.item.name}</div>
                        <Input
                          id={index}
                          type="number"
                          placeholder={row.count}
                          onChange={(e) => {
                            row.count = e.target.value;
                          }}
                        />
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
              )}
              <Button onClick={saveList}>Zapisz listę</Button>
    </>}

    {/* If Showing List was the choice */}
    {choice===0 && workplacesList.length!==0 && activeWorkplace===null &&<>
      {workplacesList.map((workplc)=>{
        return <Button onClick={()=>{
          // Setting chosen workplace as active
          setActiveWorkplace(workplc)
        }}>
          {workplc.budowa} | utw. {new Date(workplc.kiedy.toDate()).toLocaleString()}
          </Button>
      })}
    </>}

      {/* Displaying active workplace */}
      {activeWorkplace!==null && activeWorkplaceItems!==null && <>
        <Label>Nazwa budowy: {activeWorkplace.budowa}</Label>
        <Label>Stworzone przez: {activeWorkplace.kto}</Label>
        <Label>Stworzone: {new Date(activeWorkplace.kiedy.toDate()).toLocaleString()}</Label>

      {/* Displaying active workplace items */}
        {
      activeWorkplaceItems.map((przedmiot)=>{
          return <h1>{przedmiot.qr}</h1>
        })}
      </>}

      

      

    </Container>
    </Priv>
}


export default Construction