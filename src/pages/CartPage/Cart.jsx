import React, { useState, useEffect, useCallback, useRef } from "react";
import { emptycartimg, loginimg } from "../../assets/asset";
import { RiCheckLine, RiCloseLine, RiCrosshairLine, RiCrossLine, RiUserForbidLine } from "@remixicon/react";
import CartItem from "../../Components/Cart/CartItem";
import Footer from "../../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { addToCart, clearCart, setIsNewItemAdded } from "../../store/cartSlice";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import Checkout from "../../Components/Checkout/Checkout";
import Loader from "../../Components/Loader/Loader";
import CartService from '../../api/services/cart.services'
import { triggerNotification } from "../../utils/triggerNotification.utils";
import AmountTable from "../../Components/Cart/AmountTable";
import EmptyCart from "./EmptyCart";

function Cart() {
  const dispatch = useDispatch();

  const userStatus = useSelector((state) => state.authSlice.status);
  // const userData = useSelector((state) => state.authSlice.userData);
  // const userid = useSelector((state) => state.authSlice.userData?.$id);
  const totalcost = useSelector((state) => state.cartSlice?.totalAmount)

  const cartItems = useSelector((state) => state.cartSlice.cartitems);
  const isnewitemadded = useSelector((state) => state.cartSlice.isnewitemadded);
  // const [productids, setProductIds] = useState([]);
  // const [productqtys, setProductQtys] = useState([]);
  // const [cartdocids, setCartDocIds] = useState([]);
  // const [imgurls, setImgUrls] = useState([])

  const [isfetchdone, SetIsFetchDone] = useState(false); 
  const [isloading, SetIsLoading] = useState(false); 
  // const [couponCode,setCouponCode] = useState('')

  // const [getproductids, setGetProductids] = useState(false);

  const location = useLocation()

  //state to store full product details for buying items we need all the details of products 
  const [products,setProducts] = useState([])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])

  // testing feature
  // state to toggle the buy item component
  
  const [toShowBuyComp,setToShowBuyComp] = useState(false);

  const closeBuyModal = () => setToShowBuyComp(false)

  // testing feature section end
  // const fetchProducts = async () => {
  //   try {
  //     SetIsFetchDone(false);
  //     const cartdata = await Promise.all(
  //       productids.map(async (productid) => {
  //         const data =  await service.getSingleProduct(productid)
  //         setProducts((prev) => ([...prev,data]))
  //         return {
  //           ...data,
  //         };
  //         // console.log(data);
  //         // return data; // Include this if you need the data later for debugging or logging.
  //       })
  //     ); 
  //   //   console.log(cartdata);
  //     if (cartdata) {  
  //       cartdata.map((cartitem,index) => {
  //         dispatch(
  //           addToCart({
  //             documentid: cartdocids.at(index),
  //             quantity: productqtys.at(index),    // or whatever the default quantity should be
  //             previewImgUrl: previewImgUrls.at(index),
  //             ...cartitem
  //           })
  //         );    
  //       })
  //     } 
  //   //   console.log(cartItems);
  //     SetIsFetchDone(true);
  //   } catch (error) {
  //     // console.error("Error fetching product:", error);
  //     SetIsFetchDone(false);
  //   } 
  // };

  // get the items in stored in the carts collection
  const getCartProducts = async () => {
    try {
    // setGetProductids(false);
        dispatch(clearCart())      
      const cartResponse = await CartService.getCartData();
      console.log(cartResponse.data.data)

      cartResponse.data.data?.map((cartItem) => {
        dispatch(addToCart(cartItem));
      })
      


        // const productIdsArray = data.documents.map(
        //   (document) => document.productid
        // );

        // const qtyarr = data.documents.map(
        //   (document) => document.quantity
        // )
        // const cartdocs = data.documents.map(
        //   (document) => document.$id
        // )

        // const previewImgs = data.documents.map(
        //   (document) => document.previewImgUrl
        // )
        // setProductQtys(qtyarr);
        // setProductIds(productIdsArray);
        // setCartDocIds(cartdocs);
        // setPreviewImgUrls(previewImgs)
        // if (getproductids && productids.length > 0) {
        //   SetIsLoading(true);
        //     fetchProducts();
        //     SetIsLoading(false);
        // } else{
        //   SetIsFetchDone(true)
        // }
        // setGetProductids(true);
    } catch (error) { 
      // console.error("Error fetching cart items:", error);
      triggerNotification({
        type: "danger",
        title: "Error occured while fetching items",
        message: `${error.message}`
      })
      
    }
  };

  useEffect(() => {
    if (userStatus) {
      getCartProducts()  
    } 
  },[])    

  // const handleCouponSubmit = (e) => {
  //   e.preventDefault()
  //   console.log(e.target[0].value)
  // }

  // useEffect(() => {
  //   if (getproductids && productids.length > 0) {
  //     fetchProducts();
  //   }
  // }, [getproductids]);
  const notificationRef = useRef(null)

  return (
    <>
      {/* notification component  */}

      {/* Buy item  */}
      {toShowBuyComp   && <Checkout CloseModal={closeBuyModal} isOnProductPage={false}/> }

      {/* notification component  */}
      <ReactNotifications ref={notificationRef}/>

      {userStatus && cartItems.length === 0 && (
        <EmptyCart/>
      )}

      {userStatus && cartItems.length > 0 ? (
        <>
        <div className="flex flex-col">
        <div className="w-full flex mb-40  scrollbar-hide">
          <div className="w-full  flex flex-col gap-20 md:gap-0 h-screen md:flex-row">
            {/* products in cart  */}
            <div className="md:w-4/6 w-full md:h-full md:pb-32 h-[calc(100vh-55vh)] px-5">
              <div className="flex flex-col max-h-full  gap-2 my-4 overflow-y-scroll scrollbar-hide">
                {cartItems?.map((item, index) => (
                  // console.log(item)
                  <CartItem key={index} cartItemToShow={item} triggerNotificationHandler={triggerNotification}/>
                ))}
                
              </div>
            </div>
            {/* <div>
              <input type="text" placeholder="Have Coupon?" onChange={(e) => {
                e.preventDefault()
                setCouponCode(e.target.value)}
                }/>
            </div> */}

            {/* checkout section  */}
              {/* <div className="flex flex-col gap-1">
                <h1 className="font-DMSans font-bold text-2xl">Have Coupon?</h1>
                <form className="w-full flex items-center" onSubmit={handleCouponSubmit}>
                  <input type="text" placeholder="Enter coupon code"  className="w-[90%] p-3 border focus:outline-none focus:shadow-inner text-zinc-800" onChange={(e) => {
                    e.preventDefault()
                    setCouponCode(e.target.value)}
                    }/>
                  <button
                    type="submit"
                    className="bg-zinc-200 p-3 hover:bg-zinc-300 focus:outline-none"
                  >
                    <RiCheckLine size={24} className="text-zinc-700" />
                  </button>
                </form>
              </div> */}
              <AmountTable setToShowBuyComp={setToShowBuyComp} />
            {/* </div> */}
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
            // <Loader/> 
            <></>
        )
        )
      )}

      <Footer />
    </>
  );
}

export default Cart;
