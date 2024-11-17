import React, { useEffect, useState } from 'react'
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

    // state to store brand name and product title
    const [brandntitle,setBrandNTitle] = useState({
        brand: '',
        title: ''
    })

    // code to seperate the brand name and product tile 
    const seperateTitle = (title,what) => {
        // seperate the string with '|'
        const splittedarray = title.split('|')
        if(what === 'brand')
            return splittedarray.at(0)
        return splittedarray.at(1)
        // setBrandNTitle(() => (splittedarray.at(0),splittedarray.at(1)))
    }

    // useeffect hook to run the seperateTitle function on each render
    // useEffect(() => {
    //     seperateTitle(title)
    // },[])

  return (
    <>
    
        <div className='md:w-80 md:h-auto bg-white w-44  hover:shadow-md rounded-xl'>
            <RiHeart3Fill className='text-transparent stroke-2 absolute right-5 top-4 cursor-pointer hover:text-red-600 hover:stroke-none stroke-zinc-500'/>
            <div className='w-full md:min-h-72 max-h-72 bg-zinc-300 rounded-t-xl overflow-hidden'>
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
            <div className='pt-2 px-2'>
                <div className='flex flex-col '>
                    <h2 className='md:text-lg text-sm font-semibold overflow-hidden font-pathwayExtreme'>{seperateTitle(title,'brand')}</h2>
                    <h2 className='md:text-base text-xs overflow-hidden font-pathwayExtreme whitespace-nowrap  text-fade'>{seperateTitle(title,'')}</h2>
                </div>
                <div className='flex w-full items-center justify-between my-2 mb-4'>
                    <div>
                        <h4 className='text-zinc-400 font-poppins md:text-lg text-sm font-bold'>Price:</h4>
                        <h1 className='font-bold text-zinc-800 font-DMSans text-xl md:text-2xl'>{`₹${price}`}</h1>
                    </div>
                    <div className='bg-blue-700 p-3 cursor-pointer scale-75 md:scale-100 rounded-xl'>
                        <RiShoppingCartLine color='white'/>
                    </div>
                </div>
            </div>
        </div>
    
    </>
  )
}

export default Product