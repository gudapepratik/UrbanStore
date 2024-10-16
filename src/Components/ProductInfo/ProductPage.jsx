import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import service from "../../appwrite/config";
import { RiStarFill } from "@remixicon/react";
import Footer from "../Footer";
import {setIsNewItemAdded} from '../../store/cartSlice'

function ProductPage() {
  const { id } = useParams(); // unique product id
  const products = useSelector((state) => state.productSlice.products);
  // user id
  const userid = useSelector((state) => state.authSlice.userData?.$id) // userid of logged in user
  // user status
  const userstatus = useSelector((state) => state.authSlice.status)

  const [product, setProduct] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  // which product image to show as a big image i.e image[0] // 0th is initial
  const [imagetoshow,setImageToShow] = useState(0);
  // splitted product name array
  const [name,setName] = useState([])
  const dispatch = useDispatch()

  const cartItems = useSelector((state) => state.cartSlice.cartItems)

  // cart item already exists
  const [isitemalreadyexists,setIsItemAlreadyExists] = useState(false)

  const qty = 1;


  
  const handleName = (prname) => {
    if(prname){
      const splitteddata = prname.split("|")
      setName(splitteddata)
    }
  }

  useEffect(() => {
    const currentProduct = products.find((product) => product.$id === id);

    if (currentProduct) {
      setProduct(currentProduct);
      fetchImageUrls(currentProduct);
      handleName(currentProduct.name)
    }
  }, [id, products]);
  

  const fetchImageUrls = async (product) => {
    const urls = await Promise.all(
      product.image.map(async (imgId) => {
        const img = await service.getImageUrl(imgId);
        return img.href;
      })
    );
    setImageUrls(urls); // Update all image URLs at once
  };

  const handleAddToCart = async () => {
      if(userstatus){
        const data = await service.addItemToCart({userid,productid: id,qty})
        // if the product already exists then , the data.quantity will be greater than 1
        // so check this condition and update the store accordingly
        if(data) {
          if(data.quantity > 1){
            console.log("already exists")
          } else{
            console.log("new item")
          }
          // dispatch(setIsNewItemAdded()) 
        }
      } else{
        alert("User Not Logged in")
      }
  }

  return (
    <>
      {/* <h1>Product title: {product.$id}</h1>
      <h1>Product name: {product.name}</h1>
      <h1>Product category: {product.category}</h1>
      <h1>Product description: {product.description}</h1>
      <h1>Product price: {product.price}</h1>
      <h1>Product quantity: {product.stock}</h1> */}

      <div className="w-full mb-44">
        <div className="w-full flex ">
          <div className="w-4/6 flex select-none flex-col justify-start items-center">
              <div className="w-full grid grid-cols-2 flex-wrap p-4 gap-3 "> 
                {imageUrls && imageUrls.map((url,index) => (
                  <div key={index} className="w-fit overflow-hidden shadow-md transition-all duration-200"> 
                    <img src={url} alt="" className="hover:scale-105 transition-all duration-300"/>
                  </div>
                  ))}
              </div>
          </div>
          <div className="w-1/2 flex py-4 ">
            <div className="w-full selection:bg-black selection:text-white">
              <div className="flex w-full flex-col gap-2 ">
                  {/* title */}
                  <h1 className="font-DMSans font-bold text-5xl text-zinc-900">{name && name[0]}</h1>
                  {/* description  */}
                  <h4 className="font-DMSans font-light text-lg text-zinc-400">{name && name[1]}</h4>
                  {/* Rating  */}
                  <div className="flex gap-1 w-fit items-center">
                      <RiStarFill className="text-rose-600 " size={20}/>
                      <RiStarFill className="text-rose-600 " size={20}/>
                      <RiStarFill className="text-rose-600 " size={20}/>
                      <RiStarFill className="text-rose-600 " size={20}/>
                      <RiStarFill className="text-rose-600 " size={20}/>
                      <h3 className="text-zinc-400 font-DMSans text-sm">(236)</h3>
                  </div>
              </div>

              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* price  */}
              <div>
                <h1 className="font-DMSans font-bold text-4xl text-zinc-800">₹{product.price}.00</h1>
              </div>

              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* size  */}
              <div className="flex gap-2 flex-col">
                  <h3 className="font-DMSans font-light text-lg text-zinc-400">Choose a size</h3>
                  <div className="flex gap-2">
                      <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300"
                      >Xs</div>
                      <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">S</div>
                      <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">L</div>
                      <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">XL</div>
                      <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">XXL</div>
                  </div>
              </div>
              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* buttons  */}
              <div className="flex gap-2">
                <button className="font-DMSans text-white font-bold text-md px-12 py-3 bg-rose-600 rounded-full">
                  Buy Now
                </button>
                <button 
                className="font-DMSans font-bold text-md px-12 text-rose-600 py-3 border-[1px] border-rose-600 rounded-full"
                onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>

              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* product description  */}
              <div className="flex flex-col gap-2">
                <h1 className="font-DMSans font-light text-lg text-zinc-400">Product Description</h1>
                <h3 className="font-DMSans font-light text-md text-zinc-800">{product.description}</h3>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* <div>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Product image ${index + 1}`}
              className="w-full object-contain"
            />
          ))
        ) : (
          <p>Loading images...</p>
        )}
      </div> */}
      <Footer/>
    </>
  );
}

export default ProductPage;
