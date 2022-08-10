import { useEffect, useLayoutEffect, useState } from "react"
import firebase from "firebase";
import { DataGrid } from '@mui/x-data-grid';


export default function ListOfItemsInDb(){

    const [items, setItems] = useState([])
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])

    // Download items
    useEffect(()=>{
    const getItems = async () => {
        // Make a query
        const itemsResponse = await firebase.firestore().collection("przedmioty").get()

        // Initialize empty items array
        let itemsList = []

        // Push data to items array
        itemsResponse.forEach((item)=>{
            itemsList.push(item.data())
        })

        setRows(...[
            itemsList.map((item, index)=>{
                return {
                    id: index,
                    qr: item.id,
                    name: item.name,
                    category: item.category,
                    provider: item.provider,
                    smallAmount: item.smallAmount,
                    packageSize: item.packageSize,
                    unit: item.unit
                }
            })
          ])
          
        setColumns([
            { field: 'qr', headerName: 'qr', width: 150 },
            { field: 'name', headerName: 'Nazwa', width: 150 },
            { field: 'category', headerName: 'Kategoria', width: 150 },
            { field: 'provider', headerName: 'Dostawca', width: 150 },
            { field: 'packageSize', headerName: 'Ile w opakowaniu', width: 150 },
            { field: 'smallAmount', headerName: 'Mała ilość', width: 150 },
            { field: 'unit', headerName: 'Jednostka', width: 150 }
          ])
        // Set array to state
        setItems(itemsList)
    }

    // Invoke async function
    getItems()

    }, [])

    return (
    <div style={{ height: "30rem", width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
    )
}