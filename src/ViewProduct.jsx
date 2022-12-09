import React, { Component } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import  ProductService  from './Service/ProductService';
import { Button } from 'primereact/button';
import './DataViewDemo.css';

export class ViewProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: null,
            layout: 'grid',
            loading: true,
            first: 0,
            totalRecords: 0
        };
        this.rows = 6;

        this.productService = new ProductService();
        this.itemTemplate = this.itemTemplate.bind(this);
        this.onPage = this.onPage.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.productService.getAll().then(data => {
                this.datasource = data;
                this.setState({
                    totalRecords: data.length,
                    products: this.datasource.slice(0, this.rows),
                    loading: false
                });
            });
        }, 1000);
    }

    onPage(event) {
        this.setState({
            loading: true
        });

        //imitate delay of a backend call
        setTimeout(() => {
            const startIndex = event.first;
            const endIndex = Math.min(event.first + this.rows, this.state.totalRecords - 1);
            const newProducts = startIndex === endIndex ? this.datasource.slice(startIndex) : this.datasource.slice(startIndex, endIndex);

            this.setState({
                first: startIndex,
                products: newProducts,
                loading: false
            });
        }, 1000);
    }

    renderListItem(data) {
        return (
            <div className="col-12">
                <div className="product-list-item">
                    <img src={`./images/product/${data.imagen}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.nombre} />
                    <div className="product-list-detail">
                        <div className="product-name">{data.nombre}</div>
                        <div className="product-description">{data.modelo}</div>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.categoria}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.precio}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        );
    }

    renderGridItem(data) {
        return (
            <div className="col-12 md:col-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                            <span className="product-category">{data.categoria}</span>
                        </div>
                    </div>
                    <div className="product-grid-item-content">
                    <img src={`images/product/${data.imagen}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={data.name} />
                        <div className="product-name">{data.nombre}</div>
                        <div className="product-description">{data.modelo}</div>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">${data.precio}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        );
    }

    itemTemplate(product, layout) {
        if (!product) {
            return;
        }

        if (layout === 'list')
            return this.renderListItem(product);
        else if (layout === 'grid')
            return this.renderGridItem(product);
    }

    renderHeader() {
        let onOptionChange = (e) => {
            this.setState({ loading: true }, () => {
                setTimeout(() => {
                    this.setState({
                        loading: false,
                        layout: e.value
                    });
                }, 1000);
            });
        };

        return (
            <div style={{ textAlign: 'left' }}>
                <DataViewLayoutOptions layout={this.state.layout} onChange={onOptionChange} />
            </div>
        );
    }

    render() {
        const header = this.renderHeader();

        return (
            <div className="dataview-demo">
                <div className="card">
                    <DataView value={this.state.products} layout={this.state.layout} header={header}
                            itemTemplate={this.itemTemplate} lazy paginator paginatorPosition={'both'} rows={this.rows}
                            totalRecords={this.state.totalRecords} first={this.state.first} onPage={this.onPage} loading={this.state.loading} />
                </div>
            </div>
        );
    }
}