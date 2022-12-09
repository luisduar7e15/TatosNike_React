import React,{ Component } from "react";
import ProductService from "./Service/ProductService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

export class ListProduct extends Component{
    
    emptyProducto = {
        id: null,
        nombre: "",
        modelo: "",
        categoria: "",
        imagen: ""
    };

    constructor(props){
        super(props)
        this.state = {
            productos:[],
            producto: this.emptyProducto,
            visibleEdit: false,
            selectedProduct: null,
            deleteProductDialog: false
        }
        this.ProductService = new ProductService();
    }

    componentDidMount(){
        this.ProductService
        .getAll()
        .then((data)=>this.setState({productos:data}))
    }
    render(){
        const header = (
            <div className="table-header">
                <h5 className="mx-0 my-1">Manage Products</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Search..." />
                </span>
            </div>
        );
        
        const toolbarBoton = (
            <>
                <Button label="New" className="mr-2" onClick={this.showDialogNew}/>
                <Button label="Update" className="mr-2" onClick={this.showDialogEdit}/>
                <Button label="Delete" className="p-button-succes mr-2" />
            </>
        );      
        const footerDialog = (
            <React.Fragment>
                <Button label="Save" className="mr-2" onClick={this.saveProduct} />
                <Button label="Cancel" className="mr-2" onClick={this.hideDialog} />
            </React.Fragment>
        );
        const deleteProductDialogFooter = (
            <React.Fragment>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={this.hideDeleteProductDialog} />
                <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={this.deleteProduct} />
            </React.Fragment>
        
        );
        return(
            <div style={{width: '80%', margin: '0 auto', marginTop: '20px'}}>
            <Toolbar left={toolbarBoton}></Toolbar>
            <DataTable value={this.state.productos}
            dataKey="id"
            selection={this.state.selectedProduct}
            onSelectionChange={(e) => this.setState({selectedProduct: e.value})}
            paginator rows={10} rowsPerPageOptions={[5,10,25]}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={this.state.globalFilter} header={header} responsiveLayout="scroll">
                    <Column field="id" header="Id"></Column>
                    <Column field="nombre" header="Nombre"></Column>
                    <Column field="modelo" header="Modelo"></Column>
                    <Column field="categoria" header="Categoria"></Column>
                    <Column field="imagen" header="Imagen"></Column>
                </DataTable>
                <Dialog header="editProducto" visible={this.state.visibleEdit} onHide={this.hideDialog} modal="true" footer={footerDialog}>
                <span className="p-float-label">    
                             <InputText value={this.state.producto.nombre} id="nombre" 
                             onChange={(e) => this.onInputChange(e, 'nombre')} />
                            <label htmlFor="nombre">Nombre</label>
                       </span>
                       <br/>
                <span className="p-float-label">    
                             <InputText value={this.state.producto.modelo} id="modelo" 
                             onChange={(e) => this.onInputChange(e, 'modelo')} />
                            <label htmlFor="modelo">Modelo</label>
                       </span>
                       <br/>
                <span className="p-float-label">    
                             <InputText value={this.state.producto.categoria} id="categoria" 
                             onChange={(e) => this.onInputChange(e, 'categoria')} />
                            <label htmlFor="categoria">Categoria</label>
                       </span>
                       <br/>
                <span className="p-float-label">    
                             <InputText value={this.state.producto.imagen} id="imagen" 
                             onChange={(e) => this.onInputChange(e, 'imagen')} />
                            <label htmlFor="imagen">Imagen</label>
                       </span>
                       <br/>            
                </Dialog>
                <Dialog visible={this.state.deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal={true} footer={deleteProductDialogFooter} onHide={this.hideDeleteProductDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                        {this.state.producto && <span>Are you sure you want to delete <b>{this.state.producto.name}</b>?</span>}
                    </div>
                </Dialog>
                <Toast ref={(el) => this.toast = el} />

            </div>
        );
        
    }

    showDialogNew = () => {
        this.setState({visibleEdit:true}); 
        if (this.state.producto.id != null) {
            this.setState({producto : this.emptyProduct});
        }     
    }

    showDialogEdit = () => {
        this.setState({visibleEdit:true,
                       producto :this.state.selectedProduct});
    }

    hideDialog=() => {
        this.setState({
            visibleEdit: false
        });
    }

    hideDeleteProductDialog = () => {
        this.setState({deleteProductDialog :false})
    }

    onInputChange =(e, nombre) => {
        const val = (e.target && e.target.value) || '';
        let producto = {...this.state.producto};
        producto[`${nombre}`] = val;
        this.setState({ producto });
    }

    saveProduct =  () => {
        this.ProductService.save(this.state.producto).then((data) => {
            this.setState({visibleEdit : false,
                           producto : this.emptyProduct});
            this.ProductService.getAll().then((data)=>this.setState({productos : data}),
            this.toast.show({severity:'success', summary: 'Product Summited Success', detail:'Product Summit', life: 3000}));
            
        });     
    }

    deleteProduct= ()=>{
        let id = this.state.selectedProduct.id;
        let productos = [...this.state.productos];
        this.ProductService.delete(id).then( res => {
            this.setState({deleteProductDialog : false,
                            productos: productos.filter(producto => producto.id !== id)});
        });
        this.toast.show({severity:'success', summary: 'Product Deleted Success', detail:'Product Summit', life: 3000});        
        }

}