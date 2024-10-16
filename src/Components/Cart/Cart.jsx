import React, { useState, useEffect, useCallback } from "react";
import { loginimg } from "../../assets/asset";
import { RiCloseLine, RiCrosshairLine, RiCrossLine } from "@remixicon/react";
import CartItem from "./CartItem";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import service from "../../appwrite/config";
import { addToCart, clearCart, setIsNewItemAdded } from "../../store/cartSlice";

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

  const [getproductids, setGetProductids] = useState(false);

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
            fetchProducts();
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
      {userStatus ? (
        <div className="w-full  h-[calc(100vh-100px)] mb-40 overflow-y-hidden scrollbar-hide">
          <div className="w-full flex h-full">
            {/* products in cart  */}
            <div className="w-4/6  h-full px-5">
              <div className="flex flex-col  max-h-full gap-5 my-4 overflow-y-scroll scrollbar-hide">
                {cartItems?.map((item, index) => (
                  // console.log(item)
                  <CartItem key={index} product={item} />
                ))}
              </div>
            </div>

            {/* checkout section  */}
            <div className="w-2/6 mx-10 mt-4 flex flex-col gap-3 h-full">
              <h1 className="font-DMSans font-bold text-2xl">Order Summary</h1>
              <div>
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
                    ₹{totalcost+(totalcost*0.18)}
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
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="font-DMSans font-bold text-4xl text-rose-600">
            User Not Logged in{" "}
          </h1>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Cart;
