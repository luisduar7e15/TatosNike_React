import userEvent from '@testing-library/user-event';
import React, { useState,useEffect } from 'react';
import ProductService from './Service/ProductService';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";


export default function HookListProduct(){

    let emptyProduct = {
        id: null,
        nombre: "",
        modelo: "",
        categoria: "",
        imagen: "",
    };

    const [producto,setProducto] = useState(emptyProduct);
    const [productos,setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const productService = new ProductService();

    useEffect(()=>{productService
        .getAll()
        .then((data)=>(setProductos(data)))},[]);

    return(
        <>
            <div style={{width: '80%', margin: '0 auto', marginTop: '20px'}}>
            <Panel header="Products">
                <DataTable value={productos}
                    dataKey="id"
                    selection={selectedProduct}
                    onSelectionChange={(e) => (setSelectedProduct(e.value))}
                    paginator rows={10} rowsPerPageOptions={[5,10,25]}>
                            <Column field="id" header="Id"></Column>
                            <Column field="nombre" header="Nombre"></Column>
                            <Column field="modelo" header="Modelo"></Column>
                            <Column field="categoria" header="Categoria"></Column>
                            <Column field="imagen" header="Imagen"></Column>
                </DataTable>
            </Panel>
            </div>
        </>
    )
}
