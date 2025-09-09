import React, { useEffect, useState } from 'react'
import { productimg} from './index'
import { RiHeart2Line, RiHeart3Fill, RiHeartFill, RiHeartLine, RiShoppingCartLine } from '@remixicon/react'
import {useSelector,useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
import { stringify } from 'postcss'
import service from '../appwrite/config'
import ProductPageSkeleton from './ProductPageSkeleton'
import Skeleton from 'react-loading-skeleton'
import { Store } from 'react-notifications-component'
import Loader from './Loader/Loader'
import { triggerNotification } from '../utils/triggerNotification.utils'
import CartService from '../api/services/cart.services.js'

function Product({
    productDetails,
}) {

    // loading state
    const [isSkeletonloading,setIsSkeletonLoading] = useState(true)
    const [isloading,setIsLoading] = useState(false)

    const userStatus = useSelector(state => state.authSlice?.status)

    // useeffect hook to add a random time delay to give more organic feel
    useEffect(() => {
        const randomTimeOut = Math.floor(Math.random() * 10) // random value from 0 to 9
        setTimeout(() => {
            setIsSkeletonLoading(false)
        }, randomTimeOut*100);
    })

      // method to handle add to cart
    const handleAddToCart = async (e) => {
        try {
        // refer to the button
        const button = e.currentTarget
        // set loading state
        setIsLoading(true)
        if (userStatus) {
            const response = await CartService.addProductToCart({productId: productDetails._id})
            // console.log(response)
            // if the product already exists then , the data.quantity will be greater than 1
            // so check this condition and update the store accordingly
            if (response) {
                if (response.data.data.quantity > 1) {
                    triggerNotification({
                    type: "info",
                    title: "Item Quantity Updated",
                    message: "This item is already in your cart. Quantity has been updated."
                    })
                } else {
                    triggerNotification({
                    type: "success",
                    title: "Item Added to Cart",
                    message: "The selected item has been added to your cart. Continue shopping or view your cart for details."
                    })
                }
            }
        } else {
            button.disabled = true
            triggerNotification({
                type: "warning",
                title: "User not logged in",
                message: "The current operation could not be completed, consider login first"
            })
            // disable the button so that the user will not be able to click the button again and flood the screen 
            // with notifications
        }
        } catch (error) {
            triggerNotification({
                type: "danger",
                title: "Error while adding to cart",
                message: `${error.message}`
            })
        } finally{
            setIsLoading(false)
        }
    };

  return (
    <>
        {isloading && <Loader/>}
        {isSkeletonloading ?
            <ProductPageSkeleton/>
        :
            <> 
                <div className='md:w-80 md:h-auto bg-white w-44 relative  hover:shadow-md rounded-xl'>
                    {/* <RiHeart3Fill className='text-transparent stroke-[1px] absolute right-3 top-3 cursor-pointer hover:text-red-600 hover:stroke-none stroke-zinc-4 00'/> */}
                    <div className='w-full md:min-h-72 md:h-72 bg-zinc-300 rounded-t-xl overflow-hidden'>
                        <div className='absolute right-0 h-12 w-12 rounded-bl-xl flex items-center rounded-tr-xl justify-center bg-opacity-5 bg-zinc-200'>
                            <RiHeartLine className='text-zinc-50 opacity-55'/>
                        </div>
                        <NavLink to={`/products/${productDetails._id}`}>
                        <img src={productDetails.imageUrls.at(0).publicUrl} alt="product image" className=' w-full object-contain' />
                        </NavLink>
                    </div>
                    
                    <div className='pt-2 px-2'>
                        <div className='flex flex-col '>
                            <h2 className='md:text-lg text-sm font-semibold overflow-hidden font-pathwayExtreme'>{productDetails.brand}</h2>
                            <h2 className='md:text-base text-xs overflow-hidden font-pathwayExtreme whitespace-nowrap  text-fade'>{productDetails.name}</h2>
                        </div>
                        <div className='flex w-full items-center justify-between my-2 mb-4'>
                            <div>
                                <h4 className='text-zinc-400 font-poppins md:text-lg text-sm font-bold'>Price:</h4>
                                <h1 className='font-bold text-zinc-800 font-DMSans text-xl md:text-2xl'>{`₹${productDetails.price}`}</h1>
                            </div>
                            <button 
                                className='bg-rose-600 p-3 cursor-pointer scale-75 md:scale-100 rounded-xl'
                                onClick={handleAddToCart}
                            >
                                <RiShoppingCartLine color='white' size={22} className=''/>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        }
    
    </>
  )
}

export default Product