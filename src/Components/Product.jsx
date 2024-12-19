import React, { useEffect, useState } from 'react'
import { productimg} from './index'
import { RiHeart2Line, RiHeart3Fill, RiShoppingCartLine } from '@remixicon/react'
import {useSelector,useDispatch} from 'react-redux'
import { NavLink } from 'react-router-dom'
import { stringify } from 'postcss'
import service from '../appwrite/config'
import ProductPageSkeleton from './ProductPageSkeleton'
import Skeleton from 'react-loading-skeleton'
import { Store } from 'react-notifications-component'
import Loader from './Loader/Loader'

function Product({
    productId,
}) {

    // loading state
    const [isSkeletonloading,setIsSkeletonLoading] = useState(false)
    const [isloading,setIsLoading] = useState(false)

    const userStatus = useSelector(state => state.authSlice?.status)
    const userid = useSelector(state => state.authSlice?.userData?.$id)

    // splitted name state brandName and productTitle
    const [splittedName,setSplittedName] = useState([])
    
    // product state to store the current product
    const [product,setProduct] = useState({})
    
    // preview image state
    const [previewImgUrl,setPreviewImgUrl] = useState(null)

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

    // method to split the product.name into brandName and product title
    const splitName = (name) => {
        const splitted = name.split('|')
        // store the data into state variable
        setSplittedName(splitted)
    }

    // useeffect hook to fetch the product details function on each render
    useEffect(() => {
        try {
           fetchProduct()
        } catch(error) {
            console.log(error.message)
        }
    },[productId])

    // method to get the product details (from products collection) and preview image url (from storage bucket)  for the currentOrder using the product id
    const fetchProduct = async () => {
        setIsSkeletonLoading(true)
        // fetch the product using the product id
        const product = await service.getSingleProduct(productId)

        // fetch the preview image url
        const previewUrl = await service.getImageUrl(product.image.at(0))

        // call the splitName function to split the product name
        splitName(product.name)

        // store the data into state variables
        setProduct(product)
        setPreviewImgUrl(previewUrl.href)

        setIsSkeletonLoading(false)
    }

      // method to handle add to cart
    const handleAddToCart = async (e) => {
        try {
        // refer to the button
        const button = e.currentTarget
        // set loading state
        setIsLoading(true)
        if (userStatus) {
            const data = await service.addItemToCart({
            userid,
            productid: productId,
            quantity: 1,
            previewImgUrl: previewImgUrl
            })
            // if the product already exists then , the data.quantity will be greater than 1
            // so check this condition and update the store accordingly
            if (data) {
            if (data.quantity > 1) {
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
                        <NavLink to={`/products/${productId}`}>
                        {previewImgUrl ? 
                        <img src={previewImgUrl} alt="product image" className=' w-full object-contain' />
                        :
                            <Skeleton className='w-full md:min-h-72 max-h-72'/>
                        }
                        </NavLink>
                    </div>
                    <div className='pt-2 px-2'>
                        <div className='flex flex-col '>
                            <h2 className='md:text-lg text-sm font-semibold overflow-hidden font-pathwayExtreme'>{splittedName.at(0)}</h2>
                            <h2 className='md:text-base text-xs overflow-hidden font-pathwayExtreme whitespace-nowrap  text-fade'>{splittedName.at(1)}</h2>
                        </div>
                        <div className='flex w-full items-center justify-between my-2 mb-4'>
                            <div>
                                <h4 className='text-zinc-400 font-poppins md:text-lg text-sm font-bold'>Price:</h4>
                                <h1 className='font-bold text-zinc-800 font-DMSans text-xl md:text-2xl'>{`₹${product?.price}`}</h1>
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