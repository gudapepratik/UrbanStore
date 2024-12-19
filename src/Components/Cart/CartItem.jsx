import React, { useEffect, useState } from "react";
import { loginimg } from "../../assets/asset";
import { RiCloseLine } from "@remixicon/react";
import service from "../../appwrite/config";
import { useDispatch } from "react-redux";
import { removeFromCart, updateItemQuantity } from "../../store/cartSlice";
import { useNavigate } from "react-router";
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class

function CartItem({
  cartItemToShow,
  triggerNotificationHandler
}) {
  // const currentproduct = cartItemToShow
  const [splittedname,setSplittedName] = useState([])
  const [isitemdeleted,setIsItemDeleted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();

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

  // method to seperate the name
  const transformname = (name) => {
    const splitted = name.split('|')
    setSplittedName(splitted)
  }

  useEffect(() => {
      if(cartItemToShow) {
        transformname(cartItemToShow.name)
      }
  },[cartItemToShow])

  const handleDeleteitem = async () => {
    try{

      // remove the cart item from carts collection
      await service.deleteCartItem(cartItemToShow.documentid)
      
      // remove the item from redux store
      dispatch(removeFromCart(cartItemToShow.documentid))

      // trigger success notification
      triggerNotificationHandler({
        type: "info",
        title: "Item removed",
        message: "An item has been removed from your cart"
      })
    } catch(error) {
      // trigger error notification
      triggerNotificationHandler({
        type: "danger",
        title: "Error occured while deleting item",
        message: `${error.message}`
      })
    }
  }

  const goto = () => {
      const slug = `/products/${cartItemToShow.$id}`;
      setTimeout(() => {
          navigate(slug)
      },500)
  }

  // method to handle the quantity change
  const handleQuantityChange = (e) => {

    // change the quantity from redux store
    dispatch(updateItemQuantity({
      documentid: cartItemToShow.documentid,
      updatedQuantity: e.target.value
    }))
  }

  return (
    <>
      <div
      className="w-full flex border-[1px] border-zinc-400 shadow-sm p-3 items-center gap-3 cursor-pointer hover:bg-zinc-100">

        <div className="w-36 bg-white h-full overflow-hidden">
          <img src={cartItemToShow.previewImgUrl} alt="preview" className=" scale-125 translate-y-4" />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         "/>
        </div> 
        <div className="w-full flex flex-col gap-3">
          {/* brand and title  */}
          <div className="flex flex-col justify-between items-start">
            <h2 
            onClick={goto}
            className="font-DMSans text-zinc-900 font-bold text-2xl hover:underline-offset-2 hover:underline transition-all no-underline">{splittedname?.at(0)}</h2>
            <h3 className="font-DMSans text-zinc-600 text-base ">
            {splittedname?.at(1)}
            </h3>
          </div>

          {/* size and quantity  */}
          <div className="flex justify-between items-center">
            <h2 className="font-DMSans text-zinc-600 text-lg ">
              Size: <span className="font-bold text-zinc-700">M</span>
            </h2>
            <div className="flex gap-4 items-center">
              {/* <h2 className="font-DMSans text-zinc-600 text-lg ">Quantity: <span className="font-bold text-zinc-700">{product?.quantity}</span></h2> */}
              <h2 className="font-DMSans text-zinc-600 text-lg ">Quantity: </h2>
              {/* <select
                name="quantity"
                id="quantity"
                className="focus:outline-none bg-white font-DMSans"
              >
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
                <option value="">4</option>
                <option value="">5</option>
              </select> */}
              <input type="number" name="quantity" placeholder='Enter quantity to order' className='outline-none p-2 bg-zinc-100 hover:bg-white rounded-sm font-DMSans w-fit'
                  // value={quantity}
                  min={1}
                  max={5}
                  defaultValue={cartItemToShow.quantity}
                  onChange={(e) => handleQuantityChange(e)}
                  />
            </div>
          </div>

          {/* price  */}
          <div>
            <h1 className="text-xl font-DMSans font-extrabold">₹{cartItemToShow?.price}</h1>
          </div>

          {/* line  */}
          <div className="w-full h-[1px] bg-zinc-400"></div>

          {/* remove button  */}
          <div>
            <button className="hover:bg-zinc-200">
              <RiCloseLine onClick={handleDeleteitem}/>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
