import React, { useState, useEffect, useCallback } from "react";
import { emptycartimg, loginimg } from "../../assets/asset";
import { RiCloseLine, RiCrosshairLine, RiCrossLine } from "@remixicon/react";
import CartItem from "./CartItem";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import service from "../../appwrite/config";
import { useLocation } from "react-router";
import { addToCart, clearCart, setIsNewItemAdded } from "../../store/cartSlice";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class

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

  const fetchProducts = async () => {
    try {
      SetIsFetchDone(false);
      const cartdata = await Promise.all(
        productids.map(async (productid) => {
          const data =  await service.getSingleProduct(productid);
          const imgurl = await service.getImageUrl(data.image.at(0))
          // setImgUrls((prev) => [...prev,imgurl.href]) 
          return {
            ...data,
            imgurl: imgurl.href,
          };
          // console.log(data);
          // return data; // Include this if you need the data later for debugging or logging.
        })
      ); 
    //   console.log(cartdata);
      if (cartdata) {  
        // console.log(imgs)  // getting undefined here
        cartdata.map((cartitem,index) => {
          dispatch(
            addToCart({
              documentid: cartdocids.at(index),
              productid: cartitem.$id,
              name: cartitem.name,
              price: cartitem.price,
              quantity: productqtys.at(index),    // or whatever the default quantity should be
              imgurl: cartitem.imgurl, 
            })
          );    
        }); 
        console.log(cartItems)
      } 
    //   console.log(cartItems);
      SetIsFetchDone(true);
    } catch (error) {
      console.error("Error fetching product:", error);
      SetIsFetchDone(false);
    }
  };

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
        setProductQtys(qtyarr);
        setProductIds(productIdsArray);
        setCartDocIds(cartdocs);
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

  return (
    <>
      {userStatus && cartItems.length > 0 ? (
        <div className="flex flex-col">
        <div className="w-full flex md:h-[calc(100vh-100px)] mb-40 overflow-y-hidden scrollbar-hide">
          <div className="w-full  flex flex-col gap-20 md:gap-0 h-screen md:flex-row">
            {/* products in cart  */}
            <div className="md:w-4/6 w-full md:h-full md:pb-32 h-[calc(100vh-55vh)] px-5">
              <div className="flex flex-col max-h-full gap-5 my-4 overflow-y-scroll scrollbar-hide">
                {cartItems?.map((item, index) => (
                  // console.log(item)
                  <CartItem key={index} product={item} />
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
                    <h3 className="font-DMSans text-md text-zinc-500">18%</h3>
                  </div>

                  {/* total  */}
                  <div className="flex items-center justify-between p-3 ">
                    <h2 className="font-DMSans font-semibold text-base">
                      Total
                    </h2>
                    <h3 className="font-DMSans text-md font-bold text-zinc-500">
                    ₹{(totalcost+(totalcost*0.18)).toFixed(2)}
                    </h3>
                  </div>

                  {/* place order button  */}
                </div>
                <button className="bg-zinc-950 w-full font-DMSans font-bold text-white py-3 ">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        (!userStatus ? 
          <div className="w-full h-screen flex items-center justify-center">
          <h1 className="font-DMSans font-bold text-4xl text-rose-600">
            User Not Logged in{" "}
          </h1>
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
            <div className="w-full h-screen flex justify-center items-center ">
            <p className="font-bold font-DMSans text-3xl -translate-y-10 text-rose-500">Loading........</p>
            </div>
        )
        )
      )}

      <Footer />
    </>
  );
}

export default Cart;
