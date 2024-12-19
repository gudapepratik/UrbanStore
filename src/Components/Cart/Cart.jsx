import React, { useState, useEffect, useCallback } from "react";
import { emptycartimg, loginimg } from "../../assets/asset";
import { RiCloseLine, RiCrosshairLine, RiCrossLine, RiUserForbidLine } from "@remixicon/react";
import CartItem from "./CartItem";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import service from "../../appwrite/config";
import { useLocation } from "react-router";
import { addToCart, clearCart, setIsNewItemAdded } from "../../store/cartSlice";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import Checkout from "../Checkout/Checkout";
import Loader from "../Loader/Loader";

function Cart() {
  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.authSlice.status);
  const userData = useSelector((state) => state.authSlice.userData);
  const userid = useSelector((state) => state.authSlice.userData?.$id);
  const totalcost = useSelector((state) => state.cartSlice?.totalAmount)

  const cartItems = useSelector((state) => state.cartSlice.cartitems);
  const isnewitemadded = useSelector((state) => state.cartSlice.isnewitemadded);
  const [productids, setProductIds] = useState([]);
  const [productqtys, setProductQtys] = useState([]);
  const [cartdocids, setCartDocIds] = useState([]);
  const [imgurls, setImgUrls] = useState([])

  const [isfetchdone, SetIsFetchDone] = useState(false); 
  const [isloading, SetIsLoading] = useState(false); 

  const [getproductids, setGetProductids] = useState(false);

  const location = useLocation()

  //state to store full product details for buying items we need all the details of products 
  const [products,setProducts] = useState([])

  // state to store preview image urls
  const [previewImgUrls,setPreviewImgUrls] = useState([])

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])

  // const fetchProducts = async () => {
  //     try {
  //       SetIsFetchDone(false)
  //       // const promises = productids.map(async (id) => {
  //       //   const data = await service.getSingleProduct(id);
  //       //   console.log(data)
  //       //   dispatch(addToCart({
  //       //     productid: data.$id,
  //       //     name: data.name,
  //       //     price: data.price,
  //       //     quantity: 1 // or whatever the default quantity should be
  //       // }));
  //       // });

  //       const cartdata = await Promise.all(
  //         productids.map(async (productid) => {
  //           return await service.getSingleProduct(productid)
  //         })
  //       ); // Wait for all product fetches to complete.
  //       console.log(cartdata)
  //       SetIsFetchDone(true)
  //     } catch (error) {
  //       console.error('Error fetching product:', error);
  //     }
  //   };

  //   const getItems = async () => {
  //     try {
  //       setGetProductids(false)
  //       const data = await service.getCartItems(userid);
  //       if (data) {
  //         const productIdsArray = data.documents.map((document) => document.productid);
  //         setProductIds(productIdsArray);
  //         setGetProductids(true)
  //       }
  //     } catch (error) {
  //       console.error('Error fetching cart items:', error);
  //     }
  //   };

  // useEffect(() => {
  //     if (userid) {
  //       getItems();
  //       if(getproductids){
  //         fetchProducts();
  //       }
  //     }
  // }, [userid]);

  // testing feature
  // state to toggle the buy item component
  
  const [toShowBuyComp,setToShowBuyComp] = useState(false);

  const closeBuyModal = () => setToShowBuyComp(false)

  // testing feature section end
  const fetchProducts = async () => {
    try {
      SetIsFetchDone(false);
      const cartdata = await Promise.all(
        productids.map(async (productid) => {
          const data =  await service.getSingleProduct(productid)
          setProducts((prev) => ([...prev,data]))
          return {
            ...data,
          };
          // console.log(data);
          // return data; // Include this if you need the data later for debugging or logging.
        })
      ); 
    //   console.log(cartdata);
      if (cartdata) {  
        cartdata.map((cartitem,index) => {
          dispatch(
            addToCart({
              documentid: cartdocids.at(index),
              quantity: productqtys.at(index),    // or whatever the default quantity should be
              previewImgUrl: previewImgUrls.at(index),
              ...cartitem
            })
          );    
        })
      } 
    //   console.log(cartItems);
      SetIsFetchDone(true);
    } catch (error) {
      console.error("Error fetching product:", error);
      SetIsFetchDone(false);
    } 
  };

  // get the items in stored in the carts collection
  const getItems = async () => {
    try {
    setGetProductids(false);
    dispatch(clearCart())      
      const data = await service.getCartItems(userid);
      if (data) {

        const productIdsArray = data.documents.map(
          (document) => document.productid
        );

        const qtyarr = data.documents.map(
          (document) => document.quantity
        )
        const cartdocs = data.documents.map(
          (document) => document.$id
        )

        const previewImgs = data.documents.map(
          (document) => document.previewImgUrl
        )
        setProductQtys(qtyarr);
        setProductIds(productIdsArray);
        setCartDocIds(cartdocs);
        setPreviewImgUrls(previewImgs)
        if (getproductids && productids.length > 0) {
          SetIsLoading(true);
            fetchProducts();
            SetIsLoading(false);
        } else{
          SetIsFetchDone(true)
        }
        setGetProductids(true);
      }
    } catch (error) { 
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (userid) {
      getItems();  
    } 
  }, [userid]);    

  useEffect(() => {
    if (getproductids && productids.length > 0) {
      fetchProducts();
    }
  }, [getproductids]);

  const handleClickBuybutton = async (e) => {
    e.preventDefault();
    try{

      setToShowBuyComp(true)
      // check if user not logged in
      // if(!userstatus) {
      //   // disable the button if the user is not logged in
      //   e.target.disabled = true; 
      //   throw new Error("User not logged in");
      // }

      // setToShowBuyComp(true)
      

    } catch(error) {
      // if any error comes then it will notify and break the further excecution
      triggerNotification({
        type: "danger",
        title: "Error occured while deleting item",
        message: `${error.message}`
      })
    }

  }

  return (
    <>
      {/* notification component  */}

      {/* Buy item  */}
      {toShowBuyComp   && <Checkout CloseModal={closeBuyModal} Orders={cartItems}/> }

      {/* notification component  */}
      <ReactNotifications/>

      {userStatus && cartItems.length > 0 ? (
        <>
        <div className="flex flex-col">
        <div className="w-full flex md:h-[calc(100vh-100px)] mb-40 overflow-y-hidden scrollbar-hide">
          <div className="w-full  flex flex-col gap-20 md:gap-0 h-screen md:flex-row">
            {/* products in cart  */}
            <div className="md:w-4/6 w-full md:h-full md:pb-32 h-[calc(100vh-55vh)] px-5">
              <div className="flex flex-col max-h-full gap-5 my-4 overflow-y-scroll scrollbar-hide">
                {cartItems?.map((item, index) => (
                  // console.log(item)
                  <CartItem key={index} cartItemToShow={item} triggerNotificationHandler={triggerNotification}/>
                ))}
                
              </div>
            </div>

            {/* checkout section  */}
            <div className="w-full md:w-2/6 md:mx-10 mt-4 px-6 flex flex-col gap-3 h-full">
              <h1 className="font-DMSans font-bold text-2xl">Order Summary</h1>
              <div className="shadow-inner">
                <div className="w-full border-[1px] border-b-0 flex flex-col border-zinc-400 ">
                  {/* subtotal  */}
                  <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                    <h2 className="font-DMSans font-semibold text-base">
                      Items Subtotal
                    </h2>
                    <h3 className="font-DMSans text-md text-zinc-500">₹{totalcost}</h3>
                  </div>
                  {/* Tax  */}
                  <div className="flex items-center justify-between p-3 border-b-[1px] border-zinc-400">
                    <h2 className="font-DMSans font-semibold text-base">Tax</h2>
                    <h3 className="font-DMSans text-md text-zinc-500">-</h3>
                  </div>

                  {/* total  */}
                  <div className="flex items-center justify-between p-3 ">
                    <h2 className="font-DMSans font-semibold text-base">
                      Total
                    </h2>
                    <h3 className="font-DMSans text-md font-bold text-zinc-500">
                    ₹{(totalcost).toFixed(2)}
                    </h3>
                  </div>

                  {/* place order button  */}
                </div>
                <button onClick={(e) => handleClickBuybutton(e)} className="bg-zinc-950 w-full font-DMSans font-bold text-white py-3 ">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
      ) : (
        (!userStatus ? 
          <div className='w-full h-screen flex justify-center items-start'>
              <div className='md:w-1/2 mt-28 flex flex-col text-center items-center justify-center selection:bg-rose-500 selection:text-white'>
                <RiUserForbidLine className='text-rose-500 size-8 md:size-10'/>
                <h1 className='font-DMSans font-bold text-xl md:text-3xl text-rose-500'>User not Logged in</h1>
                <h1 className='font-DMSans text-sm md:text-lg text-zinc-400'>Log in to your account to unlock your order history, track your packages</h1>
              </div>

            </div>
        :

        (isfetchdone ? 
          
          (cartItems &&

        <div className="w-screen h-screen flex items-center justify-center ">
                  <div className="flex relative -top-40 flex-col items-center selection:bg-none justify-center max-w-full">
                    <img
                      src={emptycartimg}
                      alt="empty bag image"
                      className="size-32 mb-4"
                    />
                    <h1 className="selection:bg-rose-500 selection:text-white font-DMSans font-bold text-xl text-zinc-800 text-center">
                      Your cart is empty
                    </h1>
                    <h1 className="selection:bg-rose-500 selection:text-white font-DMSans font-normal text-zinc-400 text-center">
                      Looks like you have not added anything to your cart. Go ahead and explore top categories
                    </h1>
                  </div>
                </div>
          )
          :
            <Loader/>
        )
        )
      )}

      <Footer />
    </>
  );
}

export default Cart;
