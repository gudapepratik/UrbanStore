import React, { useCallback, useEffect, useState } from "react";
import { loginimg } from "../../assets/asset";
import { RiAddLine, RiCloseLine, RiDeleteBin4Line, RiDeleteBin7Line, RiHeartLine, RiSubtractLine } from "@remixicon/react";
import service from "../../appwrite/config";
import { useDispatch } from "react-redux";
import { removeFromCart, updateItemQuantity, updateItemSize } from "../../store/cartSlice";
import { useNavigate } from "react-router";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import CartService from '../../api/services/cart.services'
import { triggerNotification } from "../../utils/triggerNotification.utils";
import { debounce } from "lodash";

function CartItem({
  cartItemToShow
}) {
  // const currentproduct = cartItemToShow
  const [isitemdeleted,setIsItemDeleted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDeleteitem = async () => {
    try{

      // remove the cart item from carts collection
      await CartService.removeProductFromCart(cartItemToShow.cartItemId)
      
      // remove the item from redux store
      dispatch(removeFromCart(cartItemToShow.cartItemId))

      // trigger success notification
      triggerNotification({
        type: "info",
        title: "Item removed",
        message: "An item has been removed from your cart"
      })
    } catch(error) {
      // trigger error notification
      triggerNotification({
        type: "danger",
        title: "Error occured while deleting item",
        message: `${error.message}`
      })
    }
  }


  const goToProduct = () => {
      const slug = `/products/${cartItemToShow.productDetails._id}`;
      setTimeout(() => {
          navigate(slug)
      },300)
  }
  // Debounced function to update the backend
  const debouncedUpdateCart = useCallback(debounce(async ({productId, updatedValue, toUpdate}) => {
    // console.log("asf")
    if(toUpdate === "quantity") {
      await CartService.updateCartProductQuantity({productId: productId, quantity: updatedValue}); // Call backend only after user stops changing the quantity
    }
    if(toUpdate === "size"){
      await CartService.updateCartProductSize({productId: productId, size: updatedValue}); // Call backend only after user stops changing the quantity
    }
  }, 1000),[])

  // method to handle the quantity change
  const onQuantityChange =(updatedqty) => {
    // change the quantity from redux store
    dispatch(updateItemQuantity({
      documentId: cartItemToShow.cartItemId,
      updatedQuantity: updatedqty
    }))
    // call the api to save the quantity changes in backend also, after a delay
    debouncedUpdateCart({productId:cartItemToShow.productDetails._id ,updatedValue: updatedqty,toUpdate: "quantity"})
  }

  // method to handle the quantity change
  const onSizeChange =(updatedSize) => {
    console.log(cartItemToShow)
    // change the quantity from redux store
    dispatch(updateItemSize({
      documentId: cartItemToShow.cartItemId,
      updatedSize: updatedSize
    }))
    // console.log(cartItemToShow.size)
    // call the api to save the quantity changes in backend also, after a delay
    debouncedUpdateCart({productId: cartItemToShow.productDetails._id , updatedValue: updatedSize,toUpdate: "size"})
  }
  // useEffect(() => {
  //   console.log(cartItemToShow)
  // })




  // return (
  //   <>
  //     <div className="w-full flex border-[1px] border-zinc-400 shadow-sm p-3 items-center gap-3 cursor-pointer hover:bg-zinc-100">

  //       <div className="w-36 bg-white h-full overflow-hidden">
  //         <img src={cartItemToShow.productDetails.imageUrls.at(0).publicUrl} className="scale-125 translate-y-4" />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     "/> */}
  //       </div> 
  //       <div className="w-full flex flex-col gap-3">
  //         {/* brand and title  */}
  //         <div className="flex flex-col justify-between items-start">
  //           <h2 
  //           onClick={goto}
  //           className="font-DMSans text-zinc-900 font-bold text-2xl hover:underline-offset-2 hover:underline transition-all no-underline">{cartItemToShow.productDetails.brand}</h2>
  //           <h3 className="font-DMSans text-zinc-600 text-base ">
  //           {cartItemToShow.productDetails.name}
  //           </h3>
  //         </div>

  //         {/* size and quantity  */}
  //         <div className="flex justify-between items-center">
  //           <h2 className="font-DMSans text-zinc-600 text-lg ">
  //             Size: <span className="font-bold text-zinc-700">M</span>
  //           </h2>
  //           <div className="flex gap-4 items-center">
  //             {/* <h2 className="font-DMSans text-zinc-600 text-lg ">Quantity: <span className="font-bold text-zinc-700">{product?.quantity}</span></h2> */}
  //             <h2 className="font-DMSans text-zinc-600 text-lg ">Quantity: </h2>
  //             {/* <select
  //               name="quantity"
  //               id="quantity"
  //               className="focus:outline-none bg-white font-DMSans"
  //             >
  //               <option value="">1</option>
  //               <option value="">2</option>
  //               <option value="">3</option>
  //               <option value="">4</option>
  //               <option value="">5</option>
  //             </select> */}
  //             <input type="number" name="quantity" placeholder='Enter quantity to order' className='outline-none p-2 bg-zinc-100 hover:bg-white rounded-sm font-DMSans w-fit'
  //                 // value={quantity}
  //                 min={1}
  //                 max={5}
  //                 defaultValue={cartItemToShow.quantity}
  //                 onChange={(e) => handleQuantityChange(e)}
  //                 />
  //           </div>
  //         </div>

  //         {/* price  */}
  //         <div>
  //           <h1 className="text-xl font-DMSans font-extrabold">₹{cartItemToShow.productDetails.price}</h1>
  //         </div>

  //         {/* line  */}
  //         <div className="w-full h-[1px] bg-zinc-400"></div>

  //         {/* remove button  */}
  //         <div>
  //           <button className="hover:bg-zinc-200">
  //             <RiCloseLine onClick={handleDeleteitem}/>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
  const [currentQuantity,setCurrentQuantity] = useState(0)

  useEffect(() => {
    setCurrentQuantity(cartItemToShow.productDetails.stockInfo.find((item) => item.size === cartItemToShow.size)?.quantity)
  },[onSizeChange])

  return (
    <div className="mb-4 w-full rounded-lg border font-DMSans border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="relative w-full sm:w-24 md:h-full h-40 overflow-hidden rounded-md bg-gray-100 cursor-pointer" onClick={goToProduct}>
          <img
            src={cartItemToShow.productDetails.imageUrls.at(0).publicUrl}
            alt={cartItemToShow.productDetails.name}
          />
        </div>

        <div className="flex flex-1 flex-col w-full">
          <div className="w-full flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-base font-medium md:w-full w-[90%] text-gray-900 overflow-hidden font-pathwayExtreme whitespace-nowrap text-fade ">
                {cartItemToShow.productDetails.brand + '|' + cartItemToShow.productDetails.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">₹{cartItemToShow.productDetails.price.toFixed(2)}</p>
              {currentQuantity > 10 && <p className="text-sm text-green-600">In stock</p>}
              {currentQuantity === 0 && <p className="text-xs text-red-600">Out of Stock</p>}
              {currentQuantity !== 0 && currentQuantity < 10 && <p className="text-xs font-medium text-yellow-500">{`Only ${currentQuantity} left`}</p>}
            </div>
            <p className="text-left sm:text-right font-medium mt-2 sm:mt-0">
              ₹{(cartItemToShow.productDetails.price * cartItemToShow.quantity).toFixed(2)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap justify-between ">
            <div className="flex gap-2">
              <select 
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              value={cartItemToShow?.size || ""}
              onChange={(e) => onSizeChange(e.target.value)}
              
              >
                {cartItemToShow?.size === "" &&
                  <option value="" disabled hidden>
                    Select Size
                  </option>
                }
                {cartItemToShow.productDetails?.stockInfo && cartItemToShow.productDetails.stockInfo.map((item, key) => (
                  <option 
                  key={key} 
                  value={item?.size} 
                  className="bg-zinc-50 font-DMSans"
                  
                  >
                    {item?.size}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-1 border rounded-lg">
                <button
                  className="rounded-md border-gray-300 bg-white p-1"
                  onClick={() => onQuantityChange(Math.max(1, cartItemToShow.quantity - 1))}
                >
                  <RiSubtractLine size={16} className="text-gray-600" />
                </button>
                <span className="w-8 text-center">{cartItemToShow.quantity}</span>
                <button
                  className="rounded-md border-gray-300 bg-white p-1"
                  onClick={() => onQuantityChange(cartItemToShow.quantity + 1)}
                >
                  <RiAddLine size={16} className="text-gray-600" />
                </button>
              </div>

            </div>

            <div className="flex items-center gap-2 sm:mt-0 sm:ml-auto">
              <button className="rounded-md p-1 text-gray-400 flex gap-2 items-center hover:text-rose-500">
                <RiHeartLine size={18} />
                <p className="text-sm">Wishlist</p>
              </button>
              <button className="rounded-md p-1 text-gray-400 flex gap-2 items-center hover:text-gray-500" onClick={handleDeleteitem}>
                <RiDeleteBin7Line size={18} />
                <p className="text-sm ">Delete</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem;
