//import logo from './logo.svg';
//import './App.css';
//import HookListProduct from './HookListProduct';
//import { ListProduct } from './ListProduct';
import NavBar from './NavBar';
import {BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { DataProduct } from "./DataProduct";
import { ViewProduct } from "./ViewProduct";
import { ListProduct } from './ListProduct';

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path='/product' exact element={<ViewProduct/>}/>
        <Route path='/table' element={<DataProduct/>}/>
        <Route path='/list' element={<ListProduct/>}/>
      </Routes>
    </Router>
  );
}

export default App;
