import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {API_URL} from '../const/constants'
import {Link} from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6; // products per page

  const getList = () => {
    axios.get(API_URL)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.log(error);
        });
  }

  useEffect(() => {
    getList()
  }, []);

  const deleteProduk = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      getList()
    } catch (e) {
      console.log(e.message)
    }
  }, [])

  const deleteProdukBefore = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      getList()
    } catch (e) {
      console.log(e.message)
    }
  }

  const onDeleteClick = useCallback((id) => {
    if (window.confirm(`Anda yakin ingin menghapus produk id: ${id}?`)) {
      deleteProduk(id);
    }
    // alert('Hi')
  }, [deleteProduk]);

  return (
      <>
        <h1>Product List</h1>

        <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
        />

        <div style={{display:"flex", justifyContent: "space-evenly", marginBottom: '50px'}}>
          <button onClick={() => setPage(page - 1)}>⬅️ Previous Page</button>
          <button onClick={() => setPage(page + 1)}>Next Page ➡️</button>
        </div>

        <Link to="/add" className='button is-success'>Add new produk</Link>

        <div className='wrapper'>
          {products
              // .filter(product => {
              //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
              // })
              .slice((page - 1) * perPage, page * perPage)
              .map(product => (
                  <div className='component' key={product.id}>
                    <div style={{display: 'flex', flex: 1}}>
                      <img
                           src={product.photo_url}
                           alt={product.name}
                      />
                    </div>
                    <div style={{display: "flex", flex: 1, flexDirection: "column"}}>
                      <h3>{product.name}</h3>
                      <span>Buy Price: {product.buy_price}</span>
                      <span>Sell Price: {product.sell_price}</span>
                      <span>Stock: {product.stock}</span>

                      <div style={{display:"flex", justifyContent: "center", margin: '7px'}}>
                        <button style={{padding: '7px', marginLeft: '10px', marginRight: '10px'}}>
                          <Link to={`edit/${product.id}`} className='link'>Edit produk</Link>
                          {/*<Link to={{
                            pathname: `edit/${product.id}`,
                            state: { product }
                          }} className='link'>Edit produk</Link>*/}
                        </button>
                        <button style={{padding: '7px', marginLeft: '10px', marginRight: '10px'}} onClick={() => onDeleteClick(product.id)}>❌</button>
                      </div>
                    </div>
                  </div>
              ))
          }
        </div>
      </>
  );
}

export default ProductList;
