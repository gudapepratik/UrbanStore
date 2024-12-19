import React, { useEffect, useState } from 'react'
import Footer from '../Footer'
import Loader from '../Loader/Loader'
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import { useSelector } from 'react-redux'
import { RiArrowDropLeftLine, RiArrowDropRightLine, RiFileWarningLine, RiShoppingBag4Line, RiUserForbidLine } from '@remixicon/react'
import service from '../../appwrite/config'
import OrderCard from './OrderCard'
import OrderCardSkeleton from './OrderCardSkeleton'

function Orders() {

  // loading state
  const [isloading,setIsLoading] = useState(false)

  // current logged in user's userData
  const userData = useSelector(state => state.authSlice.userData)

  // login status
  const userStatus = useSelector(state => state.authSlice.status)

  // onpage state
  const [onpage,setOnPage] = useState(1)

  // state (array of objects) to store the orders retrieved from database
  const [orders,setOrders] = useState([])
  
  // state to store the selected filter
  const [filterCategory,setFilterCategory] = useState('allOrders')
  
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

  // cancel order triggerer invokes the cancel Order handler function when the cancel order button is clicked
  const cancelOrderTrigger = async (status,orderid) => {
    try{
      setIsLoading(true)
      if(status !== 'placed') throw new Error(`Order with orderid ${orderid} can't be cancelled once it shipped`);
      // else
      await cancelOrderHandler(orderid)
    } catch(error) {
      triggerNotification({type: "danger", title: "Error While Cancelling Order", message: `${error.message}`})
    } finally{
      setIsLoading(false)
    }
  }

  // cancel order handler 
  const cancelOrderHandler = async (orderid) => {
    await service.cancelOrder(orderid)
    // if success
    triggerNotification({type: "success", title: "Order Cancelled Successfully", message: `Order with orderid ${orderid} has been cancelled successfully, Happy Shopping!`})

    // fetch the orders again to update the states
    fetchOrders()
  }

  // useeffect hook to invoke the fetchOrders function on change in page states
  useEffect(() => {
    if(userStatus) {
      fetchOrders()
    }
  },[userStatus,onpage,filterCategory])

  // method to fetch all the orders from orders collection that are ordered by the current logged in user
  const fetchOrders = async () => {
    // set loading state
    setIsLoading(true)
    try{
      console.log(filterCategory)
      const ordersResponse = await service.getAllOrders({
        limit: 8,
        onpage: onpage,
        customer_id: userData.$id,
        filterCategory: filterCategory
      })

      console.log(ordersResponse.documents)
      setOrders(ordersResponse.documents )
    } catch(error) {
      // trigger error notification
      triggerNotification({type: "danger", title: "Unknown Error Occurred", message: `${error.message}`})
    } finally{
      setIsLoading(false)
    }
    
  }

  // method to handle the page change navigation
  const handleonpagechange = (naviagteTo) => {
    if (naviagteTo === "next") {
      setOnPage((prev) => prev + 1);
    } else {
      setOnPage((prev) => (prev !== 1 ? prev - 1 : prev));
    }
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  };


  return (
    <>
      {/* loading state  */}
      {/* {isloading && <Loader/>} */}

      {/* react notifcations component  */}
      <ReactNotifications/>

      <div className='flex w-full p-3 flex-col gap-3'>


        {/*top filter section  */}
        <div className='max-w-full flex justify-between md:mx-64 px-10 py-3 rounded-md bg-white shadow-inner border-[1px] border-zinc-400'>
            <div className='flex items-center gap-3'>
                <h3 className='font-DMSans font-medium text-lg text-zinc-900'>filter: </h3>
                <select 
                  name="Category" 
                  id="Category" 
                  className='p-2 rounded-md shadow-inner border-[1px] border-zinc-800 text-zinc-900 focus:outline-none cursor-pointer'
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  >
                  <option value={'allOrders'} className='font-DMSans'>All Orders</option>
                  <option value={'Placed'} className='font-DMSans'>Placed</option>
                  <option value={'Shipped'} className='font-DMSans'>Shipped</option>
                  <option value={'Delivered'} className='font-DMSans'>Delivered</option>
                  <option value={'Cancelled'} className='font-DMSans'>Cancelled</option>
                </select>
            </div>
        </div>

        {/* user not logged in  DONE*/}
        {!userStatus && (
          <>
            <div className='w-full h-screen flex justify-center items-start'>
              <div className='md:w-1/2 mt-28 flex flex-col text-center items-center justify-center selection:bg-rose-500 selection:text-white'>
                <RiUserForbidLine className='text-rose-500 size-8 md:size-10'/>
                <h1 className='font-DMSans font-bold text-xl md:text-3xl text-rose-500'>User not Logged in</h1>
                <h1 className='font-DMSans text-sm md:text-lg text-zinc-400'>Log in to your account to unlock your order history, track your packages</h1>
              </div>

            </div>
          </>
        )}

        {/* user is logged in but haven't ordered anything yet  DONE*/}
        {orders.length === 0 && onpage === 1 && userStatus && (
          <>
            <div className='w-full h-screen flex justify-center items-start'>
              <div className='md:w-1/2 mt-28 flex flex-col text-center items-center justify-center selection:bg-rose-500 selection:text-white'>
                <RiShoppingBag4Line className='text-rose-500 size-8 md:size-10'/>
                <h1 className='font-DMSans font-bold text-xl md:text-3xl text-rose-500'>Explore, Choose, and Order Now!</h1>
                <h1 className='font-DMSans text-sm md:text-lg text-zinc-400'>You haven’t placed any orders yet. Start exploring our collections and make your first purchase today! </h1>
              </div>
            </div>
          </>
        )}

        {/* user is logged in but haven't ordered anything yet  DONE*/}
        {orders.length === 0 && onpage !== 1 && userStatus && (
          <>
            <div className='w-full mb-40 flex justify-center items-start'>
              <div className='md:w-1/2 mt-28 flex flex-col text-center items-center justify-center selection:bg-rose-500 selection:text-white'>
                <RiFileWarningLine className='text-rose-500 size-8 md:size-10'/>
                <h1 className='font-DMSans font-bold text-xl md:text-3xl text-rose-500'>You’ve Reached the End!</h1>
                <h1 className='font-DMSans text-sm md:text-lg text-zinc-400'>Looks like you’ve scrolled through all your orders. That’s everything for now!</h1>
              </div>
            </div>
          </>
        )}

        
        {/* order list section - if user is logged in and have a order history  */}
        {orders.length !== 0 && userStatus && ( 
          <>
            <div className='w-full flex md:px-64 flex-col gap-3 justify-start'>
              {orders.map((order) => (
                <>
                  <OrderCard currentOrder={order} cancelOrderHandler={cancelOrderTrigger} />
                </>
              ))}
              
            </div>
          </>
        )}

        {/* page navigation  */}
        <div className="flex w-full items-center justify-around my-12 font-DMSans font-normal text-xl">

              {/* previous button  */}
              <button
                className="px-2 pr-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("prev")}
              >
                <RiArrowDropLeftLine className="m-0" /> Prev
              </button>

              {/* page no. */}
              <p className="text-sm md:text-base">Page {onpage}</p>

              {/* next button  */}
              <button
                className="px-2 pl-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("next")}
              >
                Next <RiArrowDropRightLine className="m-0" />
              </button>
        </div>


      </div>


      {/* <Footer/> */}
      <Footer/>
    </>
  )
}

export default Orders