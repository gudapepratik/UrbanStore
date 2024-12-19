import React, { useEffect, useState } from 'react'
import service from '../../appwrite/config'
import { NavLink } from 'react-router-dom'
// trial imports
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import OrderCardSkeleton from './OrderCardSkeleton'
import { productimg } from '..'

function OrderCard({
  currentOrder,
  cancelOrderHandler,
}) {

  // splitted name state brandName and productTitle
  const [splittedName,setSplittedName] = useState([])

  // product state
  const [product,setProduct] = useState({})

  // preview image state
  const [previewImgUrl,setPreviewImgUrl] = useState(null)

  // transformed date state
  const [transformedDate,setTransformedDate] = useState('')
  
  // transformed expected delivery date state
  const [expectedtransformedDate,setExpectedTransformedDate] = useState('')

  // loading state for fetch product
  const [isloading,setIsLoading] = useState(false)

  // handle cancel order is a method to invoke the function in Orders component to cancel the order
  const handleCancelOrder =async () => {
    try {
      cancelOrderHandler(currentOrder?.State,currentOrder?.$id)
    } catch(error) {
      // notficationHandler(error.message)
      console.log(error.message)
    }
  }

  // useeffect hook to invoke the fetchProduct method whenever the currentOrder changes
  useEffect(() => {
    fetchProduct()
    console.log("run ")
  },[currentOrder])

  // method to get the product details (from products collection) and preview image url (from storage bucket)  for the currentOrder using the product id
  const fetchProduct = async () => {
    setIsLoading(true)
    // fetch the product using the product id
    const product = await service.getSingleProduct(currentOrder.product_id)

    // fetch the preview image url
    const previewUrl = await service.getImageUrl(product.image.at(0))

    // call the splitName function to split the product name
    splitName(product.name)

    // call the dateTransform function to convert the date into readable format
    dateTransform('orderDate',currentOrder?.$createdAt)
    
    // call the dateTransform function to convert the expected date  into readable format
    dateTransform('expectedDate',currentOrder?.expected_delivery_date)

    // store the data into state variables
    setProduct(product)
    setPreviewImgUrl(previewUrl.href)

    setIsLoading(false)
  }

  // method to split the product.name into brandName and product title
  const splitName = (name) => {
    const splitted = name.split('|')
    // store the data into state variable
    setSplittedName(splitted)
  }

  // method to transform the isoDate into readable form using the toLocaleDateString() method
  const dateTransform = (what,isoDate) => {
    const date = new Date(isoDate)

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    if(what === 'orderDate'){
      setTransformedDate(formattedDate)
    } else{
      setExpectedTransformedDate(formattedDate)
    }
  }

  return (
    <>
      {isloading  ? 
      <OrderCardSkeleton/>
      :
      <>
        <div className='w-full '>
          <div className='w-full flex items-center gap-2 p-2 border-[1px] hover:shadow-lg '>
            {/* image section left  */}
            <div>
              <img src={previewImgUrl} alt="preview image" className='w-24 rounded-sm'/>
            </div>

            {/* right section -details  */}
            <div className='flex w-full flex-col gap-1 justify-start'>
              {/* brand name and title section  */}
              <div className='flex w-full flex-col justify-start'>
                <div className='flex w-full justify-between'>
                  <NavLink to={`/products/${currentOrder.product_id}`} className='font-DMSans font-medium text-base md:text-lg hover:underline cursor-pointer'>{splittedName.at(0) }</NavLink>
                  <h3 className='overflow-hidden text-[8px] md:text-[12px] flex items-center bg-zinc-100 text-zinc-400 p-[2px] px-[5px] shadow-inner rounded-full'>{currentOrder?.$id}</h3>
                </div>

                <div className='flex w-full justify-between'>
                  <h3 className='w-fit text-[12px] md:text-[14px] whitespace-nowrap text-fade -z-20'>{splittedName.at(1)?.slice(0,33)}..</h3>
                  <h4 className='text-[12px] md:text-sm  text-zinc-600'>expected delivery: <span className='font-medium text-zinc-800 text-[12px] md:text-sm'>{expectedtransformedDate}</span></h4>
                </div>
              </div>

              {/* price and quantity  */}
              <div className='flex w-full justify-between'>
                  <h4 className='text-[12px] md:text-sm   text-zinc-600'>Price: <span className='font-medium text-zinc-800 text-[12px] md:text-base'>₹{product.price}</span></h4>
                  <h4 className='text-[12px] md:text-sm  text-zinc-600'>placed on: <span className='font-medium text-zinc-800 text-[12px] md:text-sm'>{transformedDate}</span></h4>
              </div>

              {/* placed on and paymnet method  */}
              <div className='flex w-full justify-between'>
                  <h4 className='text-[12px] md:text-sm   text-zinc-600'>Quantity: <span className='font-medium text-zinc-800  text-[12px] md:text-base'>{currentOrder?.quantity}</span></h4>
                  <h4 className='text-[12px] md:text-sm   text-zinc-600'>payment method: <span className='font-medium text-zinc-800 text-[12px] md:text-sm '>{currentOrder?.paymentMethod}</span></h4>
              </div>

              {/* orderStatus and cancel order button  */}
              <div className='flex w-full justify-between items-start'>
                  <h4 className='text-[12px] md:text-sm   text-zinc-600'>Order Status: <span className={`${currentOrder?.State === 'placed' && 'text-indigo-600'} ${currentOrder?.State === 'shipped' && 'text-orange-500'} ${currentOrder?.State === 'delivered' && 'text-green-600'} ${currentOrder?.State === 'cancelled' && 'text-red-500'} font-medium text-[14px] md:text-base`}>{currentOrder?.State}</span></h4>
                  {currentOrder?.State === 'delivered'  && (

                    <button 
                      className={'font-DMSans text-xs md:text-sm bg-green-500 text-white px-[10px] py-[2px] m-1 rounded-md'}
                      disabled
                    >Delivered</button>
                  )}
                  {currentOrder?.State === 'cancelled'  && (

                    <button 
                      className={'font-DMSans text-xs md:text-sm bg-red-400 text-white px-[10px] py-[2px] m-1 rounded-md'}
                      disabled
                    >Cancelled</button>
                  )}
                  {currentOrder?.State === 'placed'  && (

                    <button 
                      className={'font-DMSans text-xs md:text-sm bg-red-500 text-white p-[8px]  rounded-md'}
                      onClick={handleCancelOrder}
                    >Cancel Order</button>
                  )}
                  {currentOrder?.State === 'shipped'  && (

                    <button 
                      className={'font-DMSans text-xs md:text-sm bg-orange-500 text-white px-[10px] py-[2px] m-1  rounded-md'}
                      disabled
                    >In transit</button>
                  )}
              </div>

            </div>
          </div>
        </div>
      </>
      }
    </>
  )
}

export default OrderCard