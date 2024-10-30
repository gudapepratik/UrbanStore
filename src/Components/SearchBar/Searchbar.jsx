import { RiSearchLine } from '@remixicon/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import {setProducts,setLoading,setError,setKey} from '../../store/productSlice'
import service, {Service} from '../../appwrite/config'

function Searchbar() {
    // const useSelector()
    const navigate = useNavigate()
    const [tosearch,setToSearch] = useState("")
    const dispatch = useDispatch()

    const handleSearch = async (e) => {
        e.target.preventDefault
        try {
          console.log(tosearch)
          // dispatch(setLoading(true))
          // const response = await service.searchProductsbyname(key)
          // console.log(response)
          // if(response){
          //   dispatch(setProducts(response.documents))
          //   navigate('/products')
          //   setKey('')
          // } else{
          //   alert("Not found")
          // }
          dispatch(setKey(tosearch))


        } catch(error){
          console.log(error)
        }
    }

  return (
    <div className="hidden sm:flex items-center">

            <input
            type="text"
            placeholder="Search for products"
            className="px-4 pr-12 py-2 bg-transparent border-[1px] border-r-0 focus:outline-none rounded-l-full text-zinc-800 text-sm placeholder:opacity-85"
            //   onChange={(data) => handleSearch(data.target.value)}
            onChange = {(data) => setToSearch(data.target.value)}
            value={tosearch}
            />
            <button className="bg-transparent border-l-0 border-[1px] px-4 py-2 rounded-r-full"
            onClick={(e) => handleSearch(e)}
            >
            <RiSearchLine className="text-zinc-400" size={20} />
            </button>
        
      </div>
  )
}

export default Searchbar