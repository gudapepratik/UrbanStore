import { RiCloseCircleLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import service from '../../appwrite/config';
import Loader from "../Loader/Loader";
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import { clearCart, setFinalAmount } from '../../store/cartSlice';
import { useLocation } from 'react-router';
import OrderService from '../../api/services/orders.services';
import { triggerNotification } from '../../utils/triggerNotification.utils';
import ErrorHandler from '../../utils/ErrorHandler.utils';

function Checkout({CloseModal, isOnProductPage}) {

  // loading state
  const [isLoading,setIsLoading] = useState(false)

  // delivery charges
  const deliveryCharge = 59;
  // platform fee (needed when a single item is being buy from productPage)
  const platformFee = 40;

  // userId
  const userId = useSelector((state) => state.authSlice.userData?.$id);

  // address state
  const [address,setAddress] = useState('')
  
  // payment method state
  const [paymentMethod,setPaymentMethod] = useState(null)

  const finalAmount = useSelector((state) => state.cartSlice.finalAmount);

  const cartItems = useSelector((state) => state.cartSlice.cartitems)

  const appliedCoupon = useSelector((state) => state.cartSlice.couponDetails)

  // dispatch to make changes in redux store
  const dispatch = useDispatch()

  // location 
  const location = useLocation()

  // // calcualte the total price 
  // useEffect(() => {
  //   dispatch(setFinalAmount(finalAmount + deliveryCharge))
  // },[])

  // method to handle submit button click
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      // if(isOnProductPage) {
      //   // redirect to another handler function to handle the single item buy
      //   singleItemToBuyHandler()
      // }
  
      if(address.length < 10 || !paymentMethod) throw new Error("All fields are required")

      const orderItemDetails = cartItems.map((item) => {
        return {
          sellerId: item.productDetails.sellerId,
          productId: item.productDetails._id,
          quantity: item.quantity,
          price: item.productDetails.price,
          size: item.size
        }
      })
      
  
      await OrderService.processPayment({
        paymentMethod,
        address,
        orders: orderItemDetails,
        totalAmount: isOnProductPage === true ? finalAmount + deliveryCharge + platformFee : finalAmount + deliveryCharge,
        couponInfo: appliedCoupon
      })
  
      triggerNotification({
        type: "success",
        title: "Successfully placed",
        message: "Order has been placed successfully, Happy Shopping!!"
      })

      // redirect the user to orders page
  
      // if(location.pathname === '/cart') {
      //   multiItemToBuyHandler()
      // } else{
      //   singleItemToBuyHandler()
      // }

    } catch (error) {
      triggerNotification({
        type: "danger",
        title: "Error occurred",
        message: `${error.message}`
      })
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl mx-6 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <button onClick={CloseModal} className="text-gray-400 hover:text-gray-500 transition-colors">
              <RiCloseCircleLine size={24} />
            </button>
          </div>

          <div>
          <div className="flex flex-col">
              <label htmlFor="address" className='block text-sm font-medium text-gray-800 mb-2'>Delivery Address</label>
              <input 
              id="address" 
              placeholder="Enter your delivery address" 
              className="h-12 border rounded-md border-zinc-200 focus:ring-1 text-base p-3" 
              onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Payment method</label>
            <div className="flex space-x-4">
              {["Online", "CashOnDelivery"].map((method) => (
                <label key={method} className="inline-flex items-center font-DMSans text-zinc-900 font-medium">
                  <input
                    type="radio"
                    name="payment-method"
                    value={method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-rose-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {method === "CashOnDelivery" ? "Cash on delivery" : method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-500">Order Total:</span>
            <span className="text-lg font-bold text-gray-900">
              ₹{(Orders.length === 1 ? OrderTotal * quantity : OrderTotal).toFixed(2)}
            </span>
          </div> */}
          <div className="rounded-lg bg-zinc-50 p-4 font-DMSans font-medium">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{finalAmount}</span>
              </div>
              {isOnProductPage && (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-medium">
                <span>Total Amount</span>
                <span>₹{isOnProductPage === true ? finalAmount + deliveryCharge + platformFee : finalAmount + deliveryCharge}</span>
              </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50">
          {}
          <button
            className="w-full py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            onClick={handleSubmit}
          >
            Place order
          </button>
        </div>
      </div>

      {isLoading && <Loader />}
      <ReactNotifications />
    </div>
  )
}

export default Checkout