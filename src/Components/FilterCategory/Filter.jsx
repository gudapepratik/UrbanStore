import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../../store/productSlice'

function Filter() {

    // get data from redux store
    const filterData = useSelector(state => state.productSlice.filterCategories)

    // dispather to change the filter in redux store
    const dispatch = useDispatch()

    // state to handle to show data
    const [toShow,setToShow] = useState(false)

    // state to store the current filter
    const [currentFilter,setCurrentFilter] = useState('All Products')

    // state to store the current category ('mens', 'womens', 'unisex')
    const [currentCategory,setCurrentCategory] = useState('')

    const handleFilterChange = (filter,type) => {
        if(type === 'single'){
            dispatch(setFilter([filter]))
        }
        if(type === 'multi'){
            dispatch(setFilter(filter))
        }
        setToShow(false)
    }

  return (
    <>
        <div className='relative font-DMSans'>
            <div className='w-full flex gap-2'>
                <button 
                className='border-[1px] border-zinc-300 px-6 rounded-md'
                onMouseEnter={() => {
                    setToShow(true)
                    setCurrentCategory('men')}
                }
                onMouseLeave={() => setToShow(false)}
                >
                    Men
                </button>
                <button 
                className='border-[1px] border-zinc-300 px-6 rounded-md'
                onMouseEnter={() => {
                    setToShow(true)
                    setCurrentCategory('women')}
                }
                onMouseLeave={() => setToShow(false)}
                >
                    Women
                </button>
                <button 
                className='border-[1px] border-zinc-300 px-6 rounded-md'
                onMouseEnter={() => {
                    setToShow(true)
                    setCurrentCategory('unisex')}
                }
                onMouseLeave={() => setToShow(false)}
                >
                    Unisex
                </button>

            </div>

            {toShow && (
                <>
                    <div
                        className="absolute left-0  z-10 top-full bg-white h-96 w-fit  max-w-[100vw] md:w-[900px] shadow-lg grid grid-cols-2 md:grid-cols-4 overflow-y-scroll scrollbar-hide border-t-2 border-red-500"
                        onMouseEnter={() => setToShow(true)}
                        onMouseLeave={() => setToShow(false)}
                        >
                        {currentCategory && Object.entries(filterData[currentCategory]).map(([category, items]) => (
                            <div key={category} className="p-6 w-full">
                            <h3 
                            className="md:text-lg text-[12px] font-semibold text-red-500 capitalize cursor-pointer hover:underline hover:text-red-600"
                            onClick={() => handleFilterChange(filterData[currentCategory][category], 'multi')}
                            >
                                {category}
                            </h3>
                            <ul className="mt-3 space-y-2">
                                {items.map((item) => (
                                    <li key={item} 
                                    className="hover:underline md:text-sm text-[12px] cursor-pointer"
                                    onClick={() => handleFilterChange(item,'single')}
                                    >
                                    {item}
                                    </li>
                                ))}
                            </ul>
                            </div>
                        ))}
                    </div>
                
                </>
            )}
        </div>
    </>
  )
}

export default Filter