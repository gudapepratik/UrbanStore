// Add product is a modal component
// Modal components :- A modal is a user interface element, usually a dialog box or popup, that appears on top of the main content, requiring users to interact with it before they can return to the main interface.

import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseCircleLine,
  RiCrossLine,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sellerService  from "../../../appwrite/sellerconfig";
import authService from "../../../appwrite/auth";
import { setLoading } from "../../../store/productSlice";
import Loader from "../../Loader/Loader";
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class

// gsap animation library
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function AddProduct({ CloseModal }) {
  // product categories
  // const productCategories = [
  //   {
  //     category: "Apparel & Accessories",
  //     subCategories: [
  //       "Men’s Clothing",
  //       "Women’s Clothing",
  //       "Kids' Clothing",
  //       "Footwear",
  //       "Bags & Luggage",
  //       "Jewelry & Accessories",
  //     ],
  //   },
  //   {
  //     category: "Electronics",
  //     subCategories: [
  //       "Mobile Phones & Tablets",
  //       "Computers & Laptops",
  //       "Cameras & Photography",
  //       "Audio & Headphones",
  //       "Wearable Tech",
  //       "Home Appliances",
  //     ],
  //   },
  //   {
  //     category: "Home & Living",
  //     subCategories: [
  //       "Furniture",
  //       "Kitchenware",
  //       "Bedding & Mattresses",
  //       "Home Decor",
  //       "Storage & Organization",
  //       "Lighting",
  //     ],
  //   },
  //   {
  //     category: "Beauty & Personal Care",
  //     subCategories: [
  //       "Skincare",
  //       "Makeup",
  //       "Hair Care",
  //       "Fragrances",
  //       "Health Supplements",
  //       "Personal Hygiene",
  //     ],
  //   },
  //   {
  //     category: "Sports & Outdoors",
  //     subCategories: [
  //       "Sports Equipment",
  //       "Outdoor Gear",
  //       "Camping & Hiking",
  //       "Exercise & Fitness",
  //       "Sportswear",
  //     ],
  //   },
  //   {
  //     category: "Books & Stationery",
  //     subCategories: [
  //       "Fiction & Non-fiction Books",
  //       "Educational & Reference Books",
  //       "Magazines & Comics",
  //       "Office Supplies",
  //       "Art & Craft Supplies",
  //     ],
  //   },
  //   {
  //     category: "Toys & Baby Products",
  //     subCategories: [
  //       "Toys & Games",
  //       "Baby Clothing",
  //       "Strollers & Car Seats",
  //       "Diapers & Baby Care",
  //     ],
  //   },
  //   {
  //     category: "Food & Beverages",
  //     subCategories: [
  //       "Snacks & Packaged Foods",
  //       "Beverages",
  //       "Condiments & Spices",
  //       "Fresh Produce",
  //       "Organic & Health Foods",
  //     ],
  //   },
  //   {
  //     category: "Health & Wellness",
  //     subCategories: [
  //       "Supplements & Vitamins",
  //       "Fitness Equipment",
  //       "Wellness Gadgets",
  //       "First Aid & Medical Supplies",
  //     ],
  //   },
  //   {
  //     category: "Automotive",
  //     subCategories: [
  //       "Car Accessories",
  //       "Bike Accessories",
  //       "Car Care Products",
  //       "Replacement Parts",
  //     ],
  //   },
  //   {
  //     category: "Pet Supplies",
  //     subCategories: [
  //       "Pet Food",
  //       "Pet Accessories",
  //       "Pet Grooming",
  //       "Pet Toys",
  //     ],
  //   },
  //   {
  //     category: "Grocery Essentials",
  //     subCategories: [
  //       "Household Cleaning Supplies",
  //       "Paper Products",
  //       "Laundry Supplies",
  //     ],
  //   },
  //   {
  //     category: "Garden & Outdoor Living",
  //     subCategories: [
  //       "Garden Tools",
  //       "Plants & Seeds",
  //       "Outdoor Furniture",
  //       "Barbecue & Grill Supplies",
  //     ],
  //   },
  // ];

  const productCategories = useSelector(state => state.productSlice.filterCategories)

  // loading state
  const [isloading,setIsLoading] = useState(false)

  // default notification
  const notification = {
    title: "Add title message",
    message: "Configurable",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
  };

  // seller details to retrive seller id and name (from redux) {userData.$id and userData.name}
  const userData = useSelector(state => state.authSlice.userData)

  //  1: Basic Product Information, 2: Pricing & Stock Details, 3: Product Description, 4: Product Images, 5: Review & Submit
  const setTitle = [
    "Basic Product Information",
    "Pricing & Stock Details",
    "Product Description",
    "Product Images",
    "Review & Submit",
  ]
  
  const [CurrentFormStep, setCurrentFormStep] = useState(0);

  // image and image preview state
  const [imagefile,setImageFile] = useState([])
  const [imagepreview,setImagePreview] = useState([])

  // product details
  const [productDetails, setProductDetails] = useState({
    brandName: "",
    productName: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
  });

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
    const handleStockInput = (e) => {
      const st = e.target.value
      if(Number.isInteger(Number(st)) && Number(st) > 0 && st !== ''){
        handleProductData(e,'stock')
      }
    }

    // validate and handle image inputs
    const handleImageInput = (e) => {
      const files = Array.from(e.target.files)
      console.log(files)

      if(files.length !== 4){
        alert('Upload exactly 4 images')
        setImageFile([])
        setImagePreview([])
      } else{
        setImageFile(files)
        const urls = files.map((file) => URL.createObjectURL(file))
        console.log(urls)
        setImagePreview(urls.map(url => {return url}))
      }
    }

  // function to handle data
  const handleProductData = (e, type) => {
    console.log(e.target.value, type);
    setProductDetails((prev) => ({ ...prev, [type]: `${e.target.value}` }));
  };

  

  // handle product submit and adding to database
  const handleSubmit = async () => {
    // join the brand name and product title
    const productName = productDetails.brandName + " | " + productDetails.productName
    try{
      setIsLoading(true)
      if(productDetails.name === '' || productDetails.category === '' || productDetails.description === ''|| productDetails.price === 0 || productDetails.stock === 0 || !imagefile){
        throw new Error("Product details missing");
      }

      // step 1: upload all 4 images to appwrite bucket and get the file id's
      const uploadres = await Promise.all(
        imagefile.map(async (file) => {
          const result = await sellerService.addNewImage(file);
          return result; // Assuming result contains the file ID or other relevant data
        })
      )

      if(!uploadres) throw new Error("Error while uploading the images to database");
      
      const fileids = uploadres.map((file) => {
        return file.$id
      })

      // add a new entry in productDetails named image containing array of file id of images
      // setProductDetails(prev => ({...prev,'image': fileids, 'sellerid': userData.$id, 'seller': userData.name}))
      const productData = {...productDetails,'image': fileids, 'sellerid': userData.$id, 'seller': userData.name, 'name': productName}

      // step 3: Add the product to products database
      await sellerService.addNewProduct(productData)

      Store.addNotification({
        ...notification,
        type: "success",
        title: "Product Added",
        message: "Product added successfully to the database",
        container: 'top-right',
        dismiss: {
          duration: 2000,
          pauseOnHover: true
        }
      })

      // reset all the states
      setProductDetails({})
      setImagePreview([])
      setImageFile([])
      setCurrentFormStep(0)
    } catch(error){
      console.log(error.message)
      Store.addNotification({
        ...notification,
        type: "danger",
        title: "Unknown Error Occurred",
        message: `${error.message}`,
        container: 'top-right',
        dismiss: {
          duration: 2000,
          pauseOnHover: true
        }
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
                  defaultValue={productDetails['brandName']}
                  onChange={(e) => handleProductData(e, "brandName")}
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
                  defaultValue={productDetails['productName']}
                  onChange={(e) => handleProductData(e, "productName")}
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
                  onChange={(e) => handleProductData(e, "category")}
                  value={productDetails["category"]}
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
          
          {/* Step 2 : Pricing & Stock Details */}
          {CurrentFormStep === 1 && (
            <div className="w-full p-5 flex font-DMSans flex-col gap-4">
              {/* Product price field */}
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

              {/* Product stock field  */}
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-base">
                  Available Stock 
                </label>
                <input
                  type="number"
                  id="stock"
                  placeholder="Enter stock quantity"
                  className="w-fit p-2 text-base rounded-md focus:outline-none focus:shadow-inner focus:border-[1px] border-zinc-700"
                  required
                  defaultValue={productDetails['stock']}
                  min={1} 
                  step={1}
                  onChange={handleStockInput}
                  
                />
              </div>
            </div>
          )}

          {/* Step 3 : Product Description */}
          {CurrentFormStep === 2 && (
          <div className="w-full p-5 flex font-DMSans flex-col gap-4">
            {/* Product description field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="text-base">
                Product description
              </label>
              <textarea 
              id="description" 
              placeholder="Enter product description" 
              required 
              maxLength={600}  
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
                        <h3 className="text-base w-2/3 text-left">{productDetails.brandName + " | " + productDetails.productName}</h3>
                      </div>

                      <div className="w-full flex items-center text-left justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product Category</label>
                        <h3 className="text-base w-2/3 text-left">{productDetails.category}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product price</label>
                        <h3 className="text-base w-2/3 text-left">{`₹ ${productDetails.price}`}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product stock</label>
                        <h3 className="text-base w-2/3 text-left">{productDetails.stock}</h3>
                      </div>

                      <div className="w-full flex items-start justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Product description</label>
                        <h3 className="text-base w-2/3 text-left h-24 overflow-scroll whitespace-pre-wrap scrollbar-hide">{productDetails.description}</h3>
                      </div>

                      <div className="w-full flex items-start justify-between border-zinc-300 pt-2">
                        <label className="text-zinc-700">Product images</label>
                        <div className="flex gap-4">
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

            {/* Next button  */}
            {CurrentFormStep === 4 ?
            <button
              className="font-DMSans gap-2 flex justify-center items-center bg-[#00B75F] font-bold text-sm text-white w-24 h-10 rounded-md"
              onClick={handleSubmit}
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
