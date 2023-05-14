import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {URL} from '../const/constants'

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10; // products per page

  const [newProduct, setNewProduct] = useState({
    name: '',
    buy_price: '',
    sell_price: '',
    stock: '',
    photo_url: ''
  });

  const getList = () => {
    axios.get(URL)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.log(error);
        });
  }

  const handleAdd = () => {
    axios.post(URL, newProduct)
        .then(res => {
          setProducts([...products, res.data]);
          setNewProduct({
            name: '',
            buy_price: '',
            sell_price: '',
            stock: '',
            photo_url: ''
          });
        })
        .catch(err => {
          console.log(err);
        });
  };

  const handleChange = e => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = id => {
    axios.delete(`${URL}/${id}`)
        .then(() => {
          setProducts(products.filter(product => product.id !== id));
        })
        .catch(err => {
          console.log(err);
        });
  };

  const handleDeleteAll = () => {
    axios.delete(URL)
        .then(() => {
          setProducts([]);
        })
        .catch(err => {
          console.log(err);
        });
  };

  useEffect(() => {
    getList()
  }, []);

  return (
      <>
        <h1>Product List</h1>

        <div style={{marginBottom: '20px'}}>
          <label>Name: </label>
          <input type="text" name="name" value={newProduct.name} onChange={handleChange}/>
          <label>Buy Price: </label>
          <input type="text" name="buy_price" value={newProduct.buy_price} onChange={handleChange}/>
          <label>Sell Price: </label>
          <input type="text" name="sell_price" value={newProduct.sell_price} onChange={handleChange}/>
          <label>Stock: </label>
          <input type="text" name="stock" value={newProduct.stock} onChange={handleChange}/>
          <label>Photo URL: </label>
          <input type="text" name="photo_url" value={newProduct.photo_url} onChange={handleChange}/>
          <button onClick={handleAdd}>Add Product</button>
          <button onClick={handleDeleteAll}>Delete All</button>
        </div>

        <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
        />

        <div style={{display:"flex", justifyContent: "space-evenly", marginBottom: '50px'}}>
          <button onClick={() => setPage(page - 1)}>Previous Page</button>
          <button onClick={() => setPage(page + 1)}>Next Page</button>
        </div>

        <ul>
          {products
              // .filter(product => {
              //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
              // })
              .slice((page - 1) * perPage, page * perPage)
              .map(product => (
                  <div className='component' key={product.id}>
                    <div style={{display: 'flex', flex: 1}}>
                      <img style={{borderRadius: '30%', width: "25%", height: "25%",}}
                           src={product.photo_url}
                           alt={product.name}/>
                    </div>
                    <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                      <h3>{product.name}</h3>
                      <span>Buy Price: {product.buy_price}</span>
                      <span>Sell Price: {product.sell_price}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
              ))
          }
        </ul>
      </>
  );
}

export default ProductList;
