import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/productlist')
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.log(error);
        });
  }, []);

  return (
      <div>
        <h1>Product List</h1>
        <ul>
          {products.map(product => (
              <div style={{borderRadius:'4px', backgroundColor: 'burlywood'}} key={product.id}>
                <h3>{product.name}</h3>
                <img style={{borderRadius: '40%'}}
                     src={product.photo_url}
                     alt={product.name}/>
                <p>Buy Price: {product.buy_price}</p>
                <p>Sell Price: {product.sell_price}</p>
                <p>Stock: {product.stock}</p>
              </div>
          ))}
        </ul>
      </div>
  );
}

export default ProductList;
