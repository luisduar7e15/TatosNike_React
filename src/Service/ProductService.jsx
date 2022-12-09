import axios from 'axios'

const URL = "http://localhost:8181/api/producto";

class ProductService{
    getAll(){
        return axios.get(URL + "/listAll").then(res => res.data);
    }
    save(producto){
        return axios.post(URL + "/saveJson", producto).then(res => res.data);
    }
    delete(id){
        return axios.delete(URL + "/delete/"+id).then(res => res.data)
    }

}

export default ProductService;