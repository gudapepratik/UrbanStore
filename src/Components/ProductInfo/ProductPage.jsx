import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import service, { Service } from "../../appwrite/config";
import { RiStarFill } from "@remixicon/react";
import Footer from "../Footer";
import { addToCart, setIsNewItemAdded } from "../../store/cartSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom'
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import Loader from "../Loader/Loader";
import { NavLink } from "react-router-dom";
import Checkout from "../Checkout/Checkout";
import { Navigation, Pagination, Zoom } from "swiper/modules";

function ProductPage() {
  const { id } = useParams(); // unique product id which gives unique id of the product to show 

  // use to find the item to show with its unique id in redux productSlice, if its not there then the 
  // item is retrieved from backend // (reason behind it) could also directly retrived from backend without first searching in the redux store
  // but if we already have the required data then why to call backend . 
  // also another reason , "when user clicks on the product card to get to this page, it means that the current product to be shown is already in the redux store
  // so we just need to find it, so it's is a more optimised way than getting the item from backend"
  const products = useSelector((state) => state.productSlice.products);
  // user id
  const userid = useSelector((state) => state.authSlice.userData?.$id); // userid of logged in user
  // user status
  const userstatus = useSelector((state) => state.authSlice.status);

  // loading state
  const [isloading,setIsLoading] = useState(false)

  // dummy notification
  const notification = {
    title: "Add title message",
    message: "Configurable",
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
  };

  // to store the details of the current item to show
  const [product, setProduct] = useState({});

  // to store the the urls of all the 4 images to show
  const [imageUrls, setImageUrls] = useState([]);

  // splitted product name array
  const [name, setName] = useState([]);

  // use to dispatch the changes to the redux store
  const dispatch = useDispatch();

  // if user click on "add to cart" then that item will be stored in redux store's cartSlice
  const cartItems = useSelector((state) => state.cartSlice.cartItems);

  // cart item already exists // 
  const [isitemalreadyexists, setIsItemAlreadyExists] = useState(false);
  
  const qty = 1;
  // state to toggle the buy item component
  const [toShowBuyComp,setToShowBuyComp] = useState(false);

  const closeBuyModal = () => setToShowBuyComp(false)

  // scroll to top implementation
  const location = useLocation()

  // notification triggerer helper function
  const triggerNotification = ({type, title, message}) => {
    // dummy notification to handle notifications
    const notification = {
      title: "Add title message",
      message: "Configurable",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
      animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
    };
      
    Store.addNotification({
      ...notification,
      type: type,
      title: title,
      message: message,
      container: 'top-right',
      dismiss: {
          duration: 2000,
          pauseOnHover: true,
      }
    });
  };

  // by default when the component is rendered it scrolls up to top smoothly
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])


  // to split the product title into "brand name" and "item title" that are seperated by '|'
  const handleName = (name) => {
    if (name) {
      const splitteddata = name.split("|");
      setName(splitteddata);
    }
  };

  // function to call the backend to get the item to be shown using it's unique id
  const fetchProduct = async () => {
    try {
      // set the loading state
      setIsLoading(true)
      // get the details from backend
      const data = await service.getSingleProduct(id)
      // store the details in local state
      setProduct(data);
      // method to fetch the image urls to be shown
      fetchImageUrls(data);
      // method to seperate name
      handleName(data.name);

    } catch(error){
      throw new Error(error);
    } finally{
      setIsLoading(false)
    }
  }

  // useEffect hook to call the fetchProduct method to get the item details to be shown using it's unique id
  useEffect(() => {
    try{
      // call a async function that will retrive the item details from backend
      fetchProduct()
    } catch(error){
      triggerNotification({
        type: 'danger',
        title: "Error Occurred",
        message: `${error.message}`
      })
    }
  }, [id, products]);

  // method to fetch image urls
  const fetchImageUrls = async (product) => {
    try {
      const urls = await Promise.all(
        product.image.map(async (imgId) => {
          const img = await service.getImageUrl(imgId);
          return img.href;
        })
      );
      setImageUrls(urls); // Update all image URLs at once
    } catch(error){
      throw new Error("Error fetchImageUrls",error);
    } 
  };

  // method to handle add to cart
  const handleAddToCart = async (e) => {
    try {
      // set loading state
      setIsLoading(true)
      if (userstatus) {
        const data = await service.addItemToCart({
          userid,
          productid: id,
          quantity: qty,
          previewImgUrl: imageUrls.at(0)
        })
        // if the product already exists then , the data.quantity will be greater than 1
        // so check this condition and update the store accordingly
        if (data) {
          if (data.quantity > 1) {
            triggerNotification({
              type: "info",
              title: "Item Quantity Updated",
              message: "This item is already in your cart. Quantity has been updated."
            })
          } else {
            triggerNotification({
              type: "success",
              title: "Item Added to Cart",
              message: "The selected item has been added to your cart. Continue shopping or view your cart for details."
            })
          }
        }
      } else {
        triggerNotification({
          type: "warning",
          title: "User not logged in",
          message: "The current operation could not be completed, consider login first"
        })
        // disable the button so that the user will not be able to click the button again and flood the screen 
        // with notifications
        e.target.disabled = true
      }
    } catch (error) {
      triggerNotification({
        type: "danger",
        title: "Error while adding to cart",
        message: `${error.message}`
      })
    } finally{
      setIsLoading(false)
    }
  };

  const handleClickBuybutton = async (e) => {
    e.preventDefault();
    try{
      // check if user not logged in
      if(!userstatus) {
        // disable the button if the user is not logged in
        e.target.disabled = true; 
        throw new Error("User not logged in");
      }
      // set state
      setToShowBuyComp(true)
    } catch(error) {
      // if any error comes then it will notify and break the further excecution
      triggerNotification({
        type: 'danger',
        title: "Error Occurred",
        message: `${error.message}`
      })
    }
  }

  return (
    <>
      <div className={` w-full flex flex-col md:flex-row lg:flex-row mb-40`}>
        {/* Loader component  */}
        {isloading && <Loader/>}

        {/* Notification Component  */}
        <ReactNotifications/>

        {/* Buy item Modal component  */}
        {toShowBuyComp && <Checkout CloseModal={closeBuyModal} Orders={[product]}/> }

        {/* For mobile: Swiper for carousel Using Swiper library for easy integration of image sliding functionality for mobile phone*/}
        <div className="md:hidden lg:hidden w-full snap-x scrollbar-hide overflow-scroll">
          <Swiper
            style={{
              '--swiper-pagination-color': '#e11d48',
            }}
            spaceBetween={10}
            slidesPerView={1}
            className="w-full"
            pagination={{
              clickable:true
            }}
            zoom = {{
              maxRatio: 2
            }}
            modules={[Zoom,Pagination]}
          >
            {imageUrls &&
              imageUrls.map((url, index) => (
                <SwiperSlide key={index} className="w-full">
                  <div className="swiper-zoom-container">
                    <img
                      src={url}
                      alt=""
                      className="w-full h-auto object-cover shadow-md"
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* For larger screens: 2x2 grid */}
        <div className="hidden md:flex lg:flex w-full md:w-4/6 flex-wrap justify-start items-center">
          <div className="grid grid-cols-2 gap-3 p-4">
            {imageUrls &&
              imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="overflow-hidden shadow-md transition-all duration-200"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-auto object-cover hover:scale-105 transition-all duration-300"
                  />
                </div>
              ))}
          </div>
        </div>
        
        <div className="w-full px-6 md:w-1/2 flex py-4 ">
          {/* Title and rating  */}
          <div className="w-full selection:bg-rose-600 selection:text-white">
              <div className="flex w-full flex-col gap-2 ">
                {/* title */}
                <h1 className="font-DMSans font-bold text-3xl md:text-5xl text-zinc-900">
                  {name && name[0]}
                </h1>
                {/* description  */}
                <h4 className="font-DMSans font-light text-lg text-zinc-400">
                  {name && name[1]}
                </h4>
                {/* Rating  */}
                <div className="flex gap-1 w-fit items-center">
                    <RiStarFill className="text-rose-600 " size={20} />
                    <RiStarFill className="text-rose-600 " size={20} />
                    <RiStarFill className="text-rose-600 " size={20} />
                    <RiStarFill className="text-rose-600 " size={20} />
                    <RiStarFill className="text-rose-600 " size={20} />
                  <h3 className="text-zinc-400 font-DMSans text-sm">(236)</h3>
                </div>
              </div>

              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* price  */}
              <div>
                <h1 className="font-DMSans font-bold text-2xl md:text-4xl text-zinc-800">
                  ₹{product.price}.00
                </h1>
              </div>

              {/* line  */}
              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* size  */}
              <div className="flex gap-2 flex-col">
                <h3 className="font-DMSans font-light text-lg text-zinc-400">
                  Choose a size
                </h3>
                <div className="flex gap-2">
                  <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">
                    Xs
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">
                    S
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">
                    L
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">
                    XL
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center font-poppins text-zinc-900 rounded-sm hover:bg-zinc-100 border-[1px] cursor-pointer border-zinc-300">
                    XXL
                  </div>
                </div>
              </div>
              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* buttons  */}
              <div className="flex gap-2 flex-col md:flex-row lg:flex-row">
                <button 
                className="font-DMSans text-white font-bold text-md px-12 py-3 bg-rose-600 rounded-full"
                onClick={(e) => handleClickBuybutton(e)}
                >
                  Buy Now
                </button>
                <button
                  className="font-DMSans font-bold text-md px-12 text-rose-600 py-3 border-[1px] hover:shadow-md border-rose-600 rounded-full"
                  onClick={(e) => handleAddToCart(e)}
                >
                  Add to Cart
                </button>
              </div>

              {/* line  */}
              <div className="h-[1px] bg-zinc-200 my-8 mx-1"></div>

              {/* product description  */}
              <div className="flex flex-col gap-2">
                <h1 className="font-DMSans font-light text-lg text-zinc-400">
                  Product Description
                </h1>
                <h3 className="font-DMSans whitespace-pre-wrap font-light text-md text-zinc-800">
                  {product.description}
                </h3>
              </div>
            </div>
          </div>
        </div>
      
      {/* Footer component  */}
      <Footer />
    </>
  );
}

export default ProductPage;
