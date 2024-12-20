import { RiCloseCircleLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import service from '../../appwrite/config';
import Loader from "../Loader/Loader";
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import { clearCart } from '../../store/cartSlice';
import { useLocation } from 'react-router';

function Checkout({CloseModal, Orders}) {
  
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

  // loading state
  const [isLoading,setIsLoading] = useState(false)

  // userId
  const userId = useSelector((state) => state.authSlice.userData?.$id);

  // quantity state
  const [quantity,setQuantity] = useState(1)

  // address state
  const [address,setAddress] = useState('')
  
  // payment method state
  const [paymentMethod,setPaymentMethod] = useState('null')
  
  // Order total state
  const [OrderTotal,setOrderTotal] = useState(0)

  // data state
  const [OrderData,setOrderData] = useState({
    'quantity': quantity,
    'address': address,
    'paymentMethod': paymentMethod
  })

  // dispatch to make changes in redux store
  const dispatch = useDispatch()

  // location 
  const location = useLocation()

  // calcualte the total price 
  useEffect(() => {
    if(Orders.length !== 1) {
      // console.log(Orders)
      setOrderTotal(() => {
        const total = Orders.reduce((prev, curr) => prev + curr.price * Number(curr.quantity), 0); // Added 0 as the initial value
        return total;
      });
    } else{
      setOrderTotal(Orders.at(0).price)
    }
  },[Orders])

  // method to handle submit button click
  const handleSubmit = async (e) => {
    
    e.preventDefault()

    if(location.pathname === '/cart') {
      multiItemToBuyHandler()
    } else{
      singleItemToBuyHandler()
    }
  }

  // function to handle single item buy when user clicks on "Buy Now" button on product page
  const singleItemToBuyHandler = async () => {

    try{

      // set loading state
      setIsLoading(true)

      // if the user not logged in
      if(!userId) throw new Error("User Not Logged in");

      // if the input fields are empty
      if(OrderData.address === '' || OrderData.paymentMethod === 'null') throw new Error("Please ensure all the details are filled");
  
      // check if item is out of stock
      if(OrderData.quantity > Orders.at(0).stock) {
        throw new Error("The requested quantity is currently unavailable. It will be restocked soon. Please try adjusting the quantity or check back later");
      }

      // get the current date and time and add 7 days to get the expected delivery date
      const current_datentime = new Date()
      const expected_delivery_date = new Date(current_datentime)
      expected_delivery_date.setDate(current_datentime.getDate() + 7)
  
  
      // create a new document in the orders collection to place the order
      await Promise.all(
        Orders.map(async (order) => {
        await service.placeOrder({
          customer_id: userId,
          seller_id: order.sellerid,
          product_id: order.$id,
          price: order.price,
          paymentMethod: OrderData.paymentMethod,
          quantity: Number(OrderData.quantity),
          address: OrderData.address,
          expected_delivery_date: expected_delivery_date
        })
      })
    )
  
      // notification of success
      triggerNotification({
        type: "success",
        title: "Order Placed Successfully",
        message: `Thank you for your order. Your items are being prepared and will be delivered by ${expected_delivery_date.toLocaleDateString("en-GB",{day: "2-digit",month: "short",year: "numeric"})}`
      })
  
      // close the dialog box
      setTimeout(() => {
        CloseModal()
      }, 3000);

    } catch(error) {
      triggerNotification({
        type: "danger",
        title: "Error while checkout",
        message: `${error.message}`
      })
    } finally{
      setIsLoading(false)
    }

  }

  // function to handle multiple item buy when user clicks on "place order" button on cart page
  const multiItemToBuyHandler = async () => {
    try{
      // set loading state
      setIsLoading(true)

      // if the user not logged in
      if(!userId) throw new Error("User Not Logged in");

      // if the input fields are empty
      if(OrderData.address === '' || OrderData.paymentMethod === 'null') throw new Error("Please ensure all the details are filled");
  
      // check if any of the item is out of stock
      Orders.forEach((order) => {
        if (order.quantity > order.stock) {
          throw new Error(`${order.name.slice(0, 10)}... is currently unavailable. Please check back later`);
        }
      });

      // get the current date and time and add 7 days to get the expected delivery date
      const current_datentime = new Date()
      const expected_delivery_date = new Date(current_datentime)
      expected_delivery_date.setDate(current_datentime.getDate() + 7)

      // if all items are in stock then create new documents in orders collection for each item in Orders 
      await Promise.all(
        Orders.map(async (order) => {
          await service.placeOrder({
            customer_id: userId,
            seller_id: order.sellerid,
            product_id: order.$id,
            price: order.price,
            paymentMethod: OrderData.paymentMethod,
            quantity: Number(order.quantity),
            address: OrderData.address,
            expected_delivery_date: expected_delivery_date
          })
        })
    )

      // paused for now
      // reduce the stock of each product  ordered by the quantity ordered
      // await Promise.all(
      //   Orders.map(async (order) => {
      //     await service.updateProductQuantity({
      //       productId: order.$id,
      //       quantityToReduce: Number(order.quantity)
      //     })
      //   })
      // )

    // delete the items from the database once the order is placed
    await Promise.all(
      Orders.map(async (order) => {
        await service.deleteCartItem(order.documentid)
      })
    )

    // once its done , empty the cart from redux store
    dispatch(clearCart())
  
    // notification of success
    triggerNotification({
      type: "success",
      title: "Order Placed Successfully",
      message: `Thank you for your order. Your items are being prepared and will be delivered by ${expected_delivery_date.toLocaleDateString("en-GB",{day: "2-digit",month: "short",year: "numeric"})}`
    })
  
      // close the dialog box
    setTimeout(() => {
      CloseModal()
    }, 3000);

    } catch(error) {
      triggerNotification({
        type: "danger",
        title: "Error while checkout",
        message: `${error.message}`
      })
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <>
        <div className='w-full fixed flex bg-zinc-700 bg-opacity-10 backdrop-blur-sm  justify-center  items-center h-screen  z-10'>
          {/* loading component  */}
          {isLoading && <Loader/> }

          {/* notifications component  */}
          <ReactNotifications/>

            <div className='w-full md:w-2/5 h-fit flex flex-col gap-4 m-3 md:m-10 mb-16 md:mb-28 p-4 bg-white '>
              
              <div className='w-full flex justify-between items-center'>
                <h1 className='font-DMSans font-bold text-4xl'>Checkout</h1>
                <button 
                onClick={() => CloseModal()}
                className=''
                >
                    <RiCloseCircleLine size={28} className='text-zinc-600'/> 
                </button>
              </div>
              {Orders.length ===1 && 
              
                <div className='flex w-full flex-col gap-1'>
                  <h2 className='font-DMSans'>Select quantity</h2>
                  <input type="number" name="quantity" placeholder='Enter quantity to order' className='outline-none p-2 bg-zinc-100 rounded-sm font-DMSans w-fit'
                  value={quantity}
                  min={1}
                  max={5}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    setOrderData((prev) => ({...prev,'quantity': e.target.value}))}
                  }
                  />
                </div>
              
              }

              <div className='flex w-full flex-col gap-1'>
                <h2 className='font-DMSans'>Address</h2>
                <input type="text" name="address" placeholder='Enter delivery address' className='outline-none p-2 bg-zinc-100 rounded-sm font-DMSans'
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  setOrderData((prev) => ({...prev,'address': e.target.value}))}
                }
                />
              </div>

              <div className='flex w-full flex-col gap-1'>
                <h2 className='font-DMSans'>Payment method</h2>
                <div className='flex gap-2'>
                    <input 
                    type="radio" 
                    name="payment-method" 
                    value={'Online'} 
                    placeholder='Enter delivery address' 
                    className='outline-none p-2 rounded-sm font-DMSans'
                    onChange={(e) => {
                      setOrderData((prev) => ({...prev,"paymentMethod": e.target.value}))}
                    }
                    />
                    <label htmlFor="/">Online</label>
                    <input type="radio" 
                    name="payment-method" 
                    value={'CashOnDelivery'} 
                    placeholder='Enter delivery address' 
                    className='outline-none p-2 rounded-sm font-DMSans'
                    onChange={(e) => {
                      setOrderData((prev) => ({...prev,"paymentMethod": e.target.value}))}
                    }
                    />
                    <label htmlFor="/">Cash on delivery</label>
                </div>
              </div>

              <div className='flex w-full  gap-1 mt-3'>
                <h2 className='font-DMSans'>Order Total:</h2>
                {Orders.length === 1?
                  <h2 className='font-DMSans font-bold'>₹{(OrderTotal*quantity).toFixed(2)}</h2>
                :
                  <h2 className='font-DMSans font-bold'>₹{(OrderTotal).toFixed(2)}</h2>
                }
              </div>

              <div className='flex w-full flex-col gap-1 mt-3'>
                <button className='bg-rose-500 border-none p-3 text-base text-white font-bold font-DMSans'
                onClick={(e) => handleSubmit(e)}
                >Place order</button>
              </div>
            </div>
        </div>
    
    </>
  )
}

export default Checkout