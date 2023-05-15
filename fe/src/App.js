import './App.css';
import ProductList from "./components/ProductList";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AddComponent} from "./components/AddComponent";
import {EditComponent} from "./components/EditComponent";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProductList/>}/>
            <Route path="add" element={<AddComponent/>}/>
            <Route path="edit/:id" element={<EditComponent/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
