import React, { useEffect, useState } from "react";
import service from "../../appwrite/config";
import { NavLink } from "react-router-dom";
// trial imports
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import OrderCardSkeleton from "./OrderCardSkeleton";
import { productimg } from "..";
import { RiCheckboxBlankCircleFill, RiCheckboxCircleFill } from "@remixicon/react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

function OrderCard({ currentOrder, cancelOrderHandler ,expandedOrder, setExpandedOrder}) {
  // splitted name state brandName and productTitle
  // const [splittedName,setSplittedName] = useState([])

  // product state
  // const [product,setProduct] = useState({})

  // preview image state
  // const [previewImgUrl,setPreviewImgUrl] = useState(null)

  // transformed date state
  const [transformedDate, setTransformedDate] = useState("");

  // transformed expected delivery date state
  const [expectedtransformedDate, setExpectedTransformedDate] = useState("");

  // loading state for fetch product
  const [isloading, setIsLoading] = useState(false);

  // state to slice the product title for different screen sizes
  const [SliceLength, setSliceLength] = useState(20);

  // handle cancel order is a method to invoke the function in Orders component to cancel the order
  const handleCancelOrder = async () => {
    try {
      cancelOrderHandler(currentOrder?.state, currentOrder?._id);
    } catch (error) {
      // notficationHandler(error.message)
      // console.log(error.message)
    }
  };

  // useeffect hook to invoke the fetchProduct method whenever the currentOrder changes
  useEffect(() => {
    // fetchProduct()
    handleSliceUpdate();
    dateTransform("orderDate", currentOrder?.createdAt);
    dateTransform("expectedDate", currentOrder?.deliveryBy);
    // console.log("run ")
  }, [currentOrder]);

  // method to get the product details (from products collection) and preview image url (from storage bucket)  for the currentOrder using the product id
  const fetchProduct = async () => {
    setIsLoading(true);
    // fetch the product using the product id
    const product = await service.getSingleProduct(currentOrder.product_id);

    // fetch the preview image url
    const previewUrl = await service.getImageUrl(product.image.at(0));

    // call the splitName function to split the product name
    splitName(product.name);

    // call the dateTransform function to convert the date into readable format
    dateTransform("orderDate", currentOrder?.createdAt);

    // call the dateTransform function to convert the expected date  into readable format
    dateTransform("expectedDate", currentOrder?.deliveryBy);

    setIsLoading(false);
  };

  // method to handle product title slice length
  const handleSliceUpdate = () => {
    if (window.innerWidth >= 768) {
      setSliceLength(50); // Medium screens and above
    } else {
      setSliceLength(20); // Small screens
    }
  };
  // method to split the product.name into brandName and product title
  // const splitName = (name) => {
  //   const splitted = name.split('|')
  //   // store the data into state variable
  //   setSplittedName(splitted)
  // }

  // method to transform the isoDate into readable form using the toLocaleDateString() method
  const dateTransform = (what, isoDate) => {
    const date = new Date(isoDate);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (what === "orderDate") {
      setTransformedDate(formattedDate);
    } else {
      setExpectedTransformedDate(formattedDate);
    }
  };

  return (
    <>
      {isloading ? (
        <OrderCardSkeleton />
      ) : (
        // <>
        //   <div className='w-full '>
        //     <div className='w-full flex items-center gap-2 p-2 border-[1px] hover:shadow-lg '>
        //       {/* image section left  */}
        //       <div>
        //         <img src={currentOrder.productDetails[0].imageUrls[0].publicUrl} alt="preview image" className='w-24 rounded-sm'/>
        //       </div>

        //       {/* right section -details  */}
        //       <div className='flex w-full flex-col gap-1 justify-start'>
        //         {/* brand name and title section  */}
        //         <div className='flex w-full flex-col justify-start'>
        //           <div className='flex w-full justify-between'>
        //             <NavLink to={`/products/${currentOrder.productId}`} className='font-DMSans font-medium text-base md:text-lg hover:underline cursor-pointer'>{currentOrder.productDetails[0].brand}</NavLink>
        //             <h3 className='overflow-hidden text-[8px] md:text-[12px] flex items-center bg-zinc-100 text-zinc-400 p-[2px] px-[5px] shadow-inner rounded-full'>{currentOrder._id}</h3>
        //           </div>

        //           <div className='flex w-full justify-between'>
        //             <h3 className='w-fit text-[12px] md:text-[14px] whitespace-nowrap text-fade -z-20'>{currentOrder.productDetails[0].name?.slice(0,SliceLength)}..</h3>
        //             <h4 className='text-[12px] md:text-sm  text-zinc-600'>delivery by: <span className='font-medium text-zinc-800 text-[12px] md:text-sm text-right'>{expectedtransformedDate}</span></h4>
        //           </div>
        //         </div>

        //         {/* price and quantity  */}
        //         <div className='flex w-full justify-between'>
        //             <h4 className='text-[12px] md:text-sm   text-zinc-600'>Price: <span className='font-medium text-zinc-800 text-[12px] md:text-base'>₹{currentOrder.price}</span></h4>
        //             <h4 className='text-[12px] md:text-sm  text-zinc-600'>placed on: <span className='font-medium text-zinc-800 text-[12px] md:text-sm'>{transformedDate}</span></h4>
        //         </div>

        //         {/* placed on and paymnet method  */}
        //         <div className='flex w-full justify-between'>
        //             <h4 className='text-[12px] md:text-sm   text-zinc-600'>Quantity: <span className='font-medium text-zinc-800  text-[12px] md:text-base'>{currentOrder.quantity}</span></h4>
        //             <h4 className='text-[12px] md:text-sm   text-zinc-600'>payment: <span className='font-medium text-zinc-800 text-[12px] md:text-sm '>{currentOrder?.paymentMethod}</span></h4>
        //         </div>

        //         {/* orderStatus and cancel order button  */}
        //         <div className='flex w-full justify-between items-start'>
        //             <h4 className='text-[12px] md:text-sm   text-zinc-600'>Order Status: <span className={`${currentOrder?.state === 'placed' && 'text-indigo-600'} ${currentOrder?.state === 'shipped' && 'text-orange-500'} ${currentOrder?.state === 'delivered' && 'text-green-600'} ${currentOrder?.state === 'cancelled' && 'text-red-500'} font-medium text-[14px] md:text-base`}>{currentOrder?.state}</span></h4>
        //             {currentOrder?.state === 'delivered'  && (

        //               <button
        //                 className={'font-DMSans text-xs md:text-sm bg-green-500 text-white px-[10px] py-[2px] m-1 rounded-md'}
        //                 disabled
        //               >Delivered</button>
        //             )}
        //             {currentOrder?.state === 'cancelled'  && (

        //               <button
        //                 className={'font-DMSans text-xs md:text-sm bg-red-400 text-white px-[10px] py-[2px] m-1 rounded-md'}
        //                 disabled
        //               >Cancelled</button>
        //             )}
        //             {currentOrder?.state === 'placed'  && (

        //               <button
        //                 className={'font-DMSans text-xs md:text-sm bg-red-500 text-white p-[8px]  rounded-md'}
        //                 onClick={handleCancelOrder}
        //               >Cancel Order</button>
        //             )}
        //             {currentOrder?.state === 'shipped'  && (

        //               <button
        //                 className={'font-DMSans text-xs md:text-sm bg-orange-500 text-white px-[10px] py-[2px] m-1  rounded-md'}
        //                 disabled
        //               >In transit</button>
        //             )}
        //         </div>

        //       </div>
        //     </div>
        //   </div>
        // </>
        <>
          <div
            className="bg-white rounded-lg overflow-hidden cursor-pointer transition-all border border-gray-100 duration-200"
            onClick={() => setExpandedOrder(id => id === currentOrder._id? '': currentOrder._id)}
          >
            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-fit">
                  <img
                    src={currentOrder.productDetails[0].imageUrls[0].publicUrl}
                    alt="image"
                    className="w-full h-full object-fill rounded"
                  />
                </div>
                <div className="font-DMSans">
                  <h3 className="font-medium text-[1rem] text-gray-900">{currentOrder.productDetails[0].brand}</h3>
                  <p className="text-sm text-zinc-500">{currentOrder.productDetails[0].name}</p>
                </div>
              </div>
              <div className="text-right font-DMSans">
                <p className="font-medium">₹{currentOrder.price}</p>
                <p className="text-sm text-gray-500">Qty: {currentOrder.quantity}</p>
              </div>
            </div>
            </div>


          <div
            className={`
                grid grid-rows-[0fr] transition-all duration-200 bg-gray-50
                ${expandedOrder === currentOrder._id ? "grid-rows-[1fr]" : ""}
              `}
          >
            <div className="overflow-hidden font-DMSans">
              <div className="p-4 text-sm space-y-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-gray-900">{currentOrder._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size ordered</span>
                  <span className="text-gray-900">{currentOrder.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery by</span>
                  <span className="text-gray-900">{expectedtransformedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Placed on</span>
                  <span className="text-gray-900">{transformedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment</span>
                  <span className="text-gray-900">{currentOrder.paymentMethod}</span>
                </div>
                <div className="pt-2">
                {currentOrder.state === 'cancelled' && (
                  <button
                    className="w-full py-2 text-red-600 font-medium font-DMSans bg-red-50 rounded transition-colors text-sm"
                  >
                    Cancelled
                  </button>
                )}
                {currentOrder.state === 'placed' && (
                  // <button
                  //   className="w-full py-2 text-red-600 font-medium font-DMSans bg-red-50 rounded transition-colors text-sm"
                  //   onClick={handleCancelOrder}
                  // >
                  //   Cancel Order
                  // </button>
                  <div className="w-full flex justify-center">
                    <ConfirmDialog actionTitle={"Cancel Order"} message={"Do you really want to cancel your order? If you proceed, you may not be able to reorder at the same price."} confirmButtonText={"Confirm"} title={"Are You Sure?"} ToDelete={handleCancelOrder}/>
                  </div>
                )}
                {currentOrder.state === 'shipped' && (
                  <div
                    className="w-full flex justify-center items-center gap-2 py-2 text-blue-500 font-medium font-DMSans bg-blue-50 rounded transition-colors text-sm"
                  >
                  <div className="w-4 h-4 border-t-transparent border-2 rounded-full border-blue-500 animate-spin "></div>
                    In transit
                  </div>
                )}
                {currentOrder.state === 'delivered' && (
                  <div
                    className="w-full flex justify-center items-center gap-2 py-2 text-green-600  font-medium font-DMSans bg-green-50 rounded transition-colors text-sm"
                  >
                  <RiCheckboxCircleFill />
                    Delivered
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderCard;
