// 'use Strict'
// Add product is a modal component
// Modal components :- A modal is a user interface element, usually a dialog box or popup, that appears on top of the main content, requiring users to interact with it before they can return to the main interface.

import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckboxBlankLine,
  RiCloseCircleLine,
  RiCrossLine,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import sellerService  from "../../../appwrite/sellerconfig";
// import authService from "../../../appwrite/auth";
// import { setLoading } from "../../../store/productSlice";
import Loader from "../../Loader/Loader";
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class

// gsap animation library
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ProductService from "../../../api/services/products.services";
import { triggerNotification } from "../../../utils/triggerNotification.utils";
import SizeSelection from "./SizeSelection";

function AddProduct({ CloseModal }) {

  const productCategories = useSelector(state => state.productSlice.filterCategories)

  // loading state
  const [isloading,setIsLoading] = useState(false)

  const [sizesInfo,setSizeInfo] = useState([])

  // seller details to retrive seller id and name (from redux) {userData.$id and userData.name}
  const userData = useSelector(state => state.authSlice.userData)

  //  1: Basic Product Information, 2: Pricing & Stock Details, 3: Product Description, 4: Product Images, 5: Review & Submit
  // const setTitle = [
  //   "Basic Product Information",
  //   "Pricing & Stock Details",
  //   "Product Description",
  //   "Product Images",
  //   "Review & Submit",
  // ]
  const setTitle = [
    "Basic Product Information",
    "Sizes Selection",
    "Product Price & Description",
    "Product Images",
    "Review & Submit",
  ]
  
  const [CurrentFormStep, setCurrentFormStep] = useState(0);

  // image and image preview state
  const [imagefile,setImageFile] = useState([])
  const [imagepreview,setImagePreview] = useState([])

  // product details
  const [productDetails, setProductDetails] = useState({
    brand: "",
    name: "",
    price: 0,
    description: "",
  });

  const [sizesToShow, setSizesToShow] = useState(["S", "M", "L", "XL", "XXL", "XXXL"])
  const [chosenCategory, setChosenCategory] = useState('Men’s Shirts')
  const [isChecked, setIsChecked] = useState([])

  // next and previous functions to navigate through form steps
  const nextStep = () =>
    setCurrentFormStep((prev) => {
      if (prev !== 4) {
        return prev + 1;
      } else {
        return prev;
      }
    });

  const prevStep = () =>
    setCurrentFormStep((prev) => {
      if (prev !== 0) {
        return prev-1
      } else{
        return prev
      }
    });

    // validate and handle stock input field
    // const handleStockInput = (e) => {
    //   const st = e.target.value
    //   if(Number.isInteger(Number(st)) && Number(st) > 0 && st !== ''){
    //     handleProductData(e,'stock')
    //   }
    // }

    // validate and handle image inputs
    const handleImageInput = (e) => {
      const files = Array.from(e.target.files)

      if(files.length !== 4){
        alert('Upload exactly 4 images')
        setImageFile([])
        setImagePreview([])
      } else{
        setImageFile(files)
        const urls = files.map((file) => URL.createObjectURL(file))
        setImagePreview(urls.map(url => {return url}))
      }
    }

  // function to handle data
  const handleProductData = (e, type) => {
    if(type === 'category') {
      // setAvailableSizes(e.target.value)
    }
    setProductDetails((prev) => ({ ...prev, [type]: `${e.target.value}` }));
  };

  const categoriesAndSizes = [
    {
      "categories": [
        "Men's Sneakers", "Men's Loafers", "Men's Formal Shoes", 
        "Men's Sandals", "Men's Slippers", "Women's Sneakers", 
        "Women's Flats", "Women's Heels", "Women's Sandals", "Women's Boots"
      ],
      "sizes": [5, 6, 7, 8, 9, 10, 11, 12]
    },
    {
      "categories": [
        "Men's Shirts", "Men's T-Shirts", "Men's Hoodies & Sweatshirts", 
        "Men's Jackets", "Men's Coats", "Men's Activewear", "Men's Innerwear", 
        "Women's Tops & T-Shirts", "Women's Dresses", "Women's Hoodies & Sweatshirts", 
        "Women's Ethnic Wear", "Women's Activewear", "Women's Innerwear", 
        "Men's Sweaters", "Men's Thermals", "Women's Sweaters", 
        "Women's Jackets & Coats", "Men's Kurtas", "Men's Sherwanis", 
        "Men's Ethnic Sets", "Women's Kurtas & Kurtis", "Women's Sarees", "Women's Lehenga Cholis",
        "Hoodies & Sweatshirts", "Activewear"
      ],
      "sizes": ["S", "M", "L", "XL", "XXL", "XXXL"]
    },
    {
      "categories": [
        "Men's Jeans", "Men's Trousers", "Men's Shorts", 
        "Women's Jeans", "Women's Trousers", "Women's Skirts", "Women's Shorts"
      ],
      "sizes": [28, 30, 32, 34, 36, 38, 40, 42, 44]
    },
    {
      "categories": [
        "Men's Watches", "Men's Belts", "Men's Sunglasses", 
        "Men's Caps & Hats", "Men's Bags & Backpacks", 
        "Women's Watches", "Women's Jewelry", "Women's Bags & Clutches", 
        "Women's Belts", "Women's Scarves & Stoles"
      ],
      "sizes": ["OneSize"]
    }
  ]

  const [selectedSizes, setSelectedSizes] = useState([]);

  const handleSizeClick = (size) => {
    setSelectedSizes((prev) => {
      const exists = prev.find((item) => item.size === size);
      if (exists) return prev; // Prevent duplicate selection
      return [...prev, { size, quantity: 1 }];
    });
  };

  const handleQuantityChange = (size, quantity) => {
    setSelectedSizes((prev) =>
      prev.map((item) =>
        item.size === size ? { ...item, quantity: Number(quantity) } : item
      )
    );
  };
  
  useEffect(() => {
    categoriesAndSizes.map((item) => {
      if(item.categories.includes(chosenCategory)) {
        setSizesToShow(item.sizes)
      }
    })
  },[chosenCategory])

  // const handleSizeToggle = (key) => {
  //   setIsChecked((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]))
  // }

  // const sizeInfoHandler = (size, quantity) => {
  //   setSizeInfo(prev => {
  //     console.log(prev)
  //     // Check if size already exists
  //     const exists = prev.find(item => item.size === size);
      
  //     if (exists) {
  //       // Update the existing size's quantity
  //       return prev.map(item => 
  //         item.size === size ? { ...item, quantity: Number(quantity) } : item
  //       );
  //     } else {
  //       // Add a new entry
  //       return [...prev];
  //     }
  //   });
  // };

  // const sizeInfoHandler = (size, quantity) => {
  //   setSizeInfo(prev => 
  //     prev.map(item =>
  //       item.size === String(size) ? { ...item, quantity: Number(quantity) } : item
  //     )
  //   );
  // };

  // const sizeInfoToggler = (size) => {
  //   setSizeInfo(prev => {
  //     console.log(prev)
  //     if (prev.some(item => item.size === size)) {
  //       // Remove the item if it exists
  //       return prev.filter(item => item.size !== size);
  //     } else {
  //       // Add the item if it does not exist
  //       return [...prev, { size: String(size), quantity: 1 }]; // Default quantity can be changed
  //     }
  //   });
  // };
  

  // handle product submit and adding to database
  const handleSubmit = async () => {
    // join the brand name and product title
    try{
      setIsLoading(true)
      if(!imagefile){
        throw new Error("Product details missing");
      }

      const productData = {...productDetails,'images': imagefile, 'stockInfo': sizesInfo, 'category': chosenCategory}

      // step 3: Add the product to products database
      await ProductService.addProduct(productData)

      triggerNotification({
        type: "success",
        title: "Product Added",
        message: "Product added successfully to the database",
      })

      // reset all the states
      setProductDetails({})
      setImagePreview([])
      setImageFile([])
      setCurrentFormStep(0)
    } catch(error){

      triggerNotification({
        type: "danger",
        title: "Unknown Error Occurred",
        message: `${error.message}`,
      })
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={`fixed flex justify-center items-center w-full h-full top-0 left-0 bg-black bg-opacity-50 backdrop-blur-sm z-50`}>
        {/* loading state render  */}
        {isloading && <Loader/>}

        {/* notifications  */}
        <ReactNotifications/>

        <div className="Container flex flex-col w-1/2 bg-zinc-200 p-2 rounded-md border-[1px] border-zinc-300">

          {/* step title and close Modal button  */}
          <div className="w-full p-4 px-5 flex justify-between items-center">
            <h2 className="font-DMSans font-bold text-3xl text-[#00B75F]">
              {setTitle.at(CurrentFormStep)}
            </h2>
            <button className="" onClick={() => CloseModal()}>
              <RiCloseCircleLine />
            </button>
          </div>

          {/* Step -1 : Basic product Information  */}
          {CurrentFormStep === 0 && (
            <div className="w-full p-5 flex font-DMSans flex-col gap-4">
              {/* Product name field */}
              <div className="flex flex-col gap-1">
                <label htmlFor="brandName" className="text-base">
                  Brand Name
                </label>
                <input
                  type="text"
                  name=""
                  id="brandName"
                  placeholder="Enter brand name"
                  className="w-fit p-2 text-base rounded-md focus:outline-none focus:shadow-inner focus:border-[1px] border-zinc-700"
                  required
                  defaultValue={productDetails['brand']}
                  onChange={(e) => handleProductData(e, "brand")}
                />
                <label htmlFor="name" className="text-base">
                  Product title
                </label>
                <input
                  type="text"
                  name=""
                  id="productName"
                  placeholder="Enter product name"
                  className="w-fit p-2 text-base rounded-md focus:outline-none focus:shadow-inner focus:border-[1px] border-zinc-700"
                  required
                  defaultValue={productDetails['name']}
                  onChange={(e) => handleProductData(e, "name")}
                />
              </div>

              {/* Product category field  */}
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-base">
                  Product Category
                </label>
                <select
                  id="Category"
                  className="p-2 rounded-md w-fit"
                  onChange={(e) => {
                    setIsChecked([])
                    setSizeInfo([])
                    setChosenCategory(e.target.value)}}
                  value={chosenCategory}
                >
                  {Object.entries(productCategories.men).map(([category, items]) => (
                                items.map((item,key) => (
                                  <option key={key} value={item} className="font-DMSans">
                                  {item}
                                </option>
                                ))
                    ))}
                  {Object.entries(productCategories.women).map(([category, items]) => (
                                items.map((item,key) => (
                                  <option key={key} value={item} className="font-DMSans">
                                  {item}
                                </option>
                                ))
                    ))}
                  {Object.entries(productCategories.unisex).map(([category, items]) => (
                                items.map((item,key) => (
                                  <option key={key} value={item} className="font-DMSans">
                                  {item}
                                </option>
                                ))
                    ))}
                </select>
              </div>
            </div>
          )}

          {/* Sizes  */}
          {CurrentFormStep === 1 && (
            <SizeSelection isChecked={isChecked} setIsChecked={setIsChecked} availableSizes={sizesToShow} sizesInfo={sizesInfo} setSizes={setSizeInfo}/>
          )}

          {/* Step 3 : Product Price & Description */}
          {CurrentFormStep === 2 && (
          <div className="w-full p-5 flex font-DMSans flex-col gap-4">
            {/* Product price  */}
            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-base">
                  Product Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter product price"
                  className="w-fit p-2 text-base rounded-md focus:outline-none focus:shadow-inner focus:border-[1px] border-zinc-700"
                  required
                  defaultValue={1}
                  min={1}
                  onChange={(e) => handleProductData(e, "price")}
                  value={productDetails['price']}
                />
              </div>
            {/* Product description field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-base">
                Product description
              </label>
              <textarea 
              id="description" 
              placeholder="Enter product description" 
              required 
              maxLength={1000}  
              className="rounded-md focus:shadow-inner max-h-72 min-h-28 p-2 focus:outline-none focus:border-[1px] border-zinc-400 scrollbar-hide"
              onChange={(e) => handleProductData(e, "description")}
              value={productDetails['description']}

              wrap="hard"
              >
              </textarea>
            </div>
          </div>
          )}

          {/* Step 4 : Product Images */}
          {CurrentFormStep === 3 && (
            <div className="w-full p-5 flex font-DMSans flex-col gap-4">
              {/* Product price field */}
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="text-base">
                  Product images
                </label>
                <input 
                  type="file" 
                  id="image" 
                  multiple 
                  required  
                  accept='image/*'
                  onChange={handleImageInput}
                  className="w-full p-2 text-base rounded-md focus:outline-none focus:shadow-inner focus:border-[1px] border-zinc-700"
                  />

                  {/* image previews  */}
                    <div className="flex gap-4">
                      {imagepreview && imagepreview.map((previewurl) => {
                        return (<img key={previewurl} src={`${previewurl}`} alt="uploaded images" className="w-20 rounded-md"/>)
                      })}
                    </div>
              </div>
            </div>
          )}

          {/* Step 4 : Review and submit */}
          {CurrentFormStep === 4 && (
            <div className="flex w-[100%-5rem] flex-col mx-4 bg-zinc-100 shadow-inner p-3 border-[1px] border-zinc-300 text-zinc-900">
                    <div className="flex w-full flex-col gap-2">
                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 pb-2">
                        <label className="text-zinc-700">Product name</label>
                        <h3 className="text-base w-2/3 text-left">{productDetails.brand + " | " + productDetails.name}</h3>
                      </div>

                      <div className="w-full flex items-center text-left justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product Category</label>
                        <h3 className="text-base w-2/3 text-left">{chosenCategory}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product price</label>
                        <h3 className="text-base w-2/3 text-left">{`₹ ${productDetails.price}`}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product stock</label>
                        {/* <h3 className="text-base w-2/3 text-left">{productDetails.stock}</h3> */}
                        <div  className="text-base w-2/3 text-left flex gap-2">
                        {sizesInfo.map((info,key) => (
                          
                          <div key={key} className="flex items-center bg-gray-100 py-1 px-3 gap-2 rounded-lg text-sm font-medium text-gray-800 border border-gray-300 shadow-sm">
                            <span className="font-semibold text-base text-green-600">{info.size}</span> <span className="text-gray-300">|</span> <span className="text-gray-500">{info.quantity}</span>
                          </div>
                          
                        ))}
                        </div>
                      </div>

                      <div className="w-full flex items-start justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product description</label>
                        <h3 className="text-base w-2/3 text-left h-24 overflow-scroll whitespace-pre-wrap scrollbar-hide">{productDetails.description}</h3>
                      </div>

                      <div className="w-full flex items-start justify-between border-zinc-300 pt-2">
                        <label className="text-zinc-700">Product images</label>
                        <div className="flex gap-4 w-2/3 justify-start">
                            {imagepreview && imagepreview.map((previewurl) => {
                              return (<img key={previewurl} src={`${previewurl}`} alt="uploaded images" className="w-20 rounded-md"/>)
                            })}
                        </div>
                      </div>
                    </div>
                </div>
          )}


          {/* next and prev buttons  */}
          <div className="w-full p-4 px-5 flex justify-between items-center">
            {/* Previous button  */}
            <button
              className="font-DMSans gap-2 flex justify-center items-center bg-[#00B75F] font-bold text-sm text-white w-28 h-10 rounded-md"
              onClick={prevStep}
            >
              <RiArrowLeftLine size={18} /> Previous
            </button>

            
            {CurrentFormStep === 4 ?
            <button
              className="font-DMSans gap-2 flex justify-center items-center bg-[#00B75F] opacity-70 font-bold text-sm text-white w-24 h-10 rounded-md"
              onClick={handleSubmit}
              // disabled // temporarily disabled
              >
                Submit
            </button>
            :
            
            <button
                className="font-DMSans gap-2 flex justify-center items-center bg-[#00B75F] font-bold text-sm text-white w-24 h-10 rounded-md"
                onClick={nextStep}
              >
                Next <RiArrowRightLine size={18} />
            </button>
            }
          </div>

        </div>
      </div>
    </>
  );
}

export default AddProduct;
