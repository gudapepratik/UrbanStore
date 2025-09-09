import React, { useEffect, useState } from 'react'
// import { fetchProducts } from '../api/httpClient'

function About() {
  const [products,setProducts] = useState([])
  
  // const fetchData =  async () => {
  //   const response = await fetchProducts()
  //   console.log(response)
  //   setProducts(response.data)
  // }

  // useEffect(() => {
  //   ;(async () => {
  //     const response = await fetchProducts()
  //     console.log(response.data)
  //     setProducts(response.data.products)
  //   })()
  // },[])
  
  return (
    <div>
      {products && products.length > 0 && products.map((product) => (
        <div key={product._id}>
          <h1>{product.name}</h1>
        </div>
        ))}
    </div>
  )
}

export default About