import React from 'react'
import { productimg, image } from './index'
import { RiHeart2Line, RiHeart3Fill, RiShoppingCartLine } from '@remixicon/react'
import {useSelector,useDispatch} from 'react-redux'
import {setProducts,setLoading,setError} from '../store/productSlice'
import { NavLink } from 'react-router-dom'
import { stringify } from 'postcss'

function Product({
    id,
    title,
    price,
    imageurl,
}) {

    const getimage = (imagepromise) => {
        imagepromise.then((result) => {
            // console.log(result)
            return result;
        })
    }
  return (
    <>
    
        <div className='w-80 h-auto bg-white hover:shadow-md rounded-xl relative'>
            <RiHeart3Fill className='text-transparent stroke-2 absolute right-5 top-4 cursor-pointer hover:text-red-600 hover:stroke-none stroke-zinc-500'/>
            <div className='w-full min-h-72 max-h-72 bg-zinc-300 rounded-t-xl overflow-hidden'>
                <NavLink to={`/products/${id}`}>
                    {imageurl? 
                        <img src={imageurl} alt="product" className=' w-full object-contain' />
                    : 
                        <p>Loading...........</p>
                    }
                    {/* {
                        console.log(imageurl)
                    } */}
                    
                </NavLink>
            </div>
            <div className='pt-2 px-6'>
                <h2 className='text-lg font-pathwayExtreme h-20'>{title}</h2>
                <div className='flex w-full items-center justify-between my-2 mb-4'>
                    <div>
                        <h4 className='text-zinc-400 font-poppins font-bold'>Price:</h4>
                        <h1 className='font-bold text-zinc-800 font-DMSans text-2xl'>{`₹${price}`}</h1>
                    </div>
                    <div className='bg-blue-700 p-3 cursor-pointer rounded-xl'>
                        <RiShoppingCartLine color='white'/>
                    </div>
                </div>
            </div>
        </div>
    
    </>
  )
}

export default Product