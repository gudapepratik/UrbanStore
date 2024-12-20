import {
    RiArrowLeftLine,
    RiArrowRightDoubleLine,
    RiArrowRightLine,
    RiCloseCircleLine,
    RiCrossLine,
  } from "@remixicon/react";
  import React, { useEffect, useState } from "react";
  import { useSelector, useDispatch } from "react-redux";
  import sellerService from "../../../appwrite/sellerconfig";
  import authService from "../../../appwrite/auth";
  import { setLoading } from "../../../store/productSlice";
  import Loader from "../../Loader/Loader";
  import { ReactNotifications, Store } from 'react-notifications-component';
  import 'react-notifications-component/dist/theme.css';
  import 'animate.css/animate.min.css';
  
  function EditOrderModal({ CloseEditModal, orderDetails, updateDetailsTrigger }) {

    // loading state
    const [isloading,setIsLoading] = useState(false)

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

    // method to process order
    const handleProcessOrder = async (type) => {
        try {
            // set the loading state
            setIsLoading(true)

            if(type === 'ship'){
                await sellerService.updateOrderStatus(
                    {orderId: orderDetails.order_id, 
                    productId: orderDetails.product_id, 
                    currentStock: orderDetails.product_stock, 
                    quantityOrdered: orderDetails.quantity_ordered, 
                    updateStatus: 'ship'}
                )

                triggerNotification({
                    type: 'info',
                    title: 'Order Status Updated',
                    message: `THe status for order ID ${orderDetails.order_id} has been updated to 'Shipped'`
                })
            }

            if(type === 'deliver'){
                await sellerService.updateOrderStatus({
                    orderId: orderDetails.order_id,
                    updateStatus: 'deliver'
                })

                triggerNotification({
                    type: 'info',
                    title: 'Order Status Updated',
                    message: `THe status for order ID ${orderDetails.order_id} has been updated to 'delivered'`
                })
            }

            if(type === 'cancel'){
                await sellerService.updateOrderStatus({
                    orderId: orderDetails.order_id,
                    updateStatus: 'cancel'
                })

                triggerNotification({
                    type: 'info',
                    title: 'Order Status Updated',
                    message: `The status for order ID ${orderDetails.order_id} has been updated to 'cancelled'`
                })
            }

            // trigger to get update the details
            // updateDetailsTrigger()
        } catch (error) {
            triggerNotification({
                type: 'danger',
                title: 'Failed to update order status.',
                message: error.message
            })
        } finally {
            setIsLoading(false)
        }
    };

    return (
      <>

        <div className="fixed flex justify-center items-center w-full h-full top-0 left-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <ReactNotifications />
          {isloading && <Loader/>}
          <div className="bg-white p-6 shadow-lg  w-[70vw] font-DMSans h-[90vh] Container flex flex-col rounded-md selection:bg-zinc-700 selection:text-white">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-end gap-3">
                    <h2 className="text-3xl font-bold">Edit Order</h2>
                    <div className="flex gap-2 items-center">
                      <label className="font-light text-xs">Last updated on:</label>
                      <p className="text-sm font-medium">
                        {new Date(orderDetails.last_updated_on).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                        })}
                      </p>
                    </div>
                </div>
                <button
                onClick={CloseEditModal}
                className=" text-zinc-700 p-2 rounded-full"
                >
                    <RiCloseCircleLine size={30}/>
                </button>
            </div>


            <div className="w-full flex justify-between gap-2 font-DMSans">
                {/* left section */}
                <div className="flex w-1/2 flex-col p-3 border-[1px] border-zinc-300 text-zinc-900">
                    <label className="w-full border-b-[1px] border-zinc-300 pb-2 font-medium">Order Details</label>
                    <div className="flex w-full flex-col gap-2">
                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Order Id</label>
                        <h3 className="text-base w-1/2 text-left">{orderDetails.order_id}</h3>
                      </div>

                      <div className="w-full flex items-center text-left justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Placed On</label>
                        <h3 className="text-base w-1/2 text-left">
                          {new Date(orderDetails.order_datetime).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                          })}
                        </h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Target Delivery Date</label>
                        <h3 className="text-base w-1/2 text-left">
                        {new Date(orderDetails.expected_delivery_date).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                                })}
                        </h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Current State</label>
                        <h3 className="text-base w-1/2 text-left">{orderDetails.State}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Quantity Ordered</label>
                        <h3 className="text-base w-1/2 text-left">{orderDetails.quantity_ordered}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Order Total</label>
                        <h3 className="text-base w-1/2 text-left">₹{(orderDetails.price*orderDetails.quantity_ordered).toFixed(2)}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Payment Type</label>
                        <h3 className="text-base w-1/2 text-left">{orderDetails.paymentMethod}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between">
                        <label className="text-zinc-700">Delivery Address</label>
                        <h3 className="text-sm w-1/2 text-left">{orderDetails.address}</h3>
                      </div>

                    </div>
                </div>


                {/* right section  */}
                <div className="w-1/2 flex flex-col gap-4 justify-between">
                  {/* customer details section  */}
                  <div className="flex w-full flex-col p-3 border-[1px] border-zinc-300 text-zinc-900">
                  <label className="w-full border-b-[1px] border-zinc-300 pb-2 font-medium">Customer Details</label>
                      <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <label className="text-zinc-700">Customer ID</label>
                        <h3 className="text-base w-1/2 text-left">{orderDetails.customer_id}</h3>
                      </div>

                      <div className="w-full flex items-center justify-between pt-2">
                        <label className="text-zinc-700">Customer Contact</label>
                        <h3 className="text-base w-1/2 text-left">NA</h3>
                      </div>
                  </div>

                  {/* product details section  */}
                  <div className="flex w-full flex-col  p-3 border-[1px] border-zinc-300 text-zinc-900">
                    <label className="w-full border-b-[1px] border-zinc-300 pb-2 font-medium">Product Details</label>
                    <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                        <div className="flex gap-1 justify-between ">
                            <img src={orderDetails.previewImgUrl} alt="previewImg" className="w-20 h-28  object-center rounded"/>
                            <div className="w-1/2 flex flex-col gap-1">
                              <h3 className="text-base text-left">{orderDetails.product_name}</h3>
                              <h4 className="text-base font-bold text-zinc-900">₹{orderDetails.price}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                      <label className="text-zinc-700">Product ID</label>
                      <h3 className="text-base w-1/2 text-left">{orderDetails.product_id}</h3>
                    </div>

                    <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                      <label className="text-zinc-700">Category</label>
                      <h3 className="text-base w-1/2 text-left">{orderDetails.product_category}</h3>
                    </div>

                    <div className="w-full flex items-center justify-between pt-2">
                      <label className="text-zinc-700">Available Stock</label>
                      <h3 className="text-base w-1/2 text-left">{orderDetails.product_stock}</h3>
                    </div>


                  </div>

                </div>
            </div>
            <div className="flex items-center justify-start gap-3 mt-6">
              {orderDetails.State === "placed" && (
                <>
                
                    <button
                    onClick={() => handleProcessOrder('ship')}
                    className="px-4 py-2 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600"
                    >
                    Ship Order <RiArrowRightDoubleLine/>
                    </button>

                    <button
                        onClick={() => handleProcessOrder('cancel')}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                        Cancel Order
                    </button>
                </>
              )}

              {orderDetails.State === "shipped" && (
                  <>
                      <button
                      onClick={() => handleProcessOrder('deliver')}
                      className="px-4 py-2 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600"
                      >
                      Deliver Order <RiArrowRightDoubleLine/>
                      </button>
                  </>
              )}

              {orderDetails.State === 'delivered' && (
                <>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-full"
                        disabled
                    >
                        Completed
                    </button>
                </>
              )}

              {orderDetails.State === 'cancelled' && (
                <>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-full"
                        disabled
                    >
                        Cancelled
                    </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default EditOrderModal;
  