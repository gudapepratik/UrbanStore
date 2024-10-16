import React , {useEffect, useState}from 'react'
import Product from './Product'
import service from '../appwrite/config'
import {setProducts,setError,setLoading} from '../store/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RiArrowDropLeftLine, RiArrowDropRightLine, RiPlayReverseLine } from '@remixicon/react'
import Footer from './Footer'


function Productlist() {
    const dispatch = useDispatch()
    const products = useSelector(state => state.productSlice.products)
    const isloading = useSelector(state => state.productSlice.isloading)

    const [onpage,setOnPage] = useState(1);

    // trail
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                dispatch(setLoading(true))
                const response = await service.getProducts()
                dispatch(setProducts(response.documents))

                // Fetch and resolve image URLs
                const urls = await Promise.all(response.documents.map(async (product) => {
                    const imageUrl = await service.getImageUrl(product.image[0]);
                    return { id: product.$id, url: imageUrl.href }; // Assuming getImageUrl returns { href: 'url' }
                }));
                setImageUrls(urls)
                // Set resolved URLs in state
                // const urlMap = {};
                // urls.forEach(item => {
                //     urlMap[item.id] = item.url;
                // });

            } catch(error){
                console.log(error)
            }
        }

        fetchProducts()
    },[dispatch])

    const getImageUrl = (id) => {
        const image = imageUrls.find(img => img.id === id); // Use find instead of filter
        return image ? image.url : null; // Return null if image is not found yet
    }

    const handleonpagechange = (what) => {
        if(what === 'next'){
            setOnPage(prev => prev+1)
        } else{
            setOnPage(prev => prev !== 1 ? prev-1:prev)
        }
    }

  return (
    <>
        <div className='container mx-auto p-6'>
            {isloading ?
                <div className="w-full h-screen bg-transparent bg-opacity-5 backdrop-blur-sm flex items-center justify-center">
                <div className="p-8 border-t-transparent border-8 rounded-full border-rose-500 animate-spin ">
                </div>
            </div>

            :
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products && products.map((product) => (
                            <Product
                            key={product.$id}
                            id={product.$id}
                            title={product.name}
                            price={product.price}
                            imageurl={getImageUrl(product.$id)}
                            />
                        ))}
                </div>

                <div className='flex w-full items-center justify-around my-12 font-DMSans font-bold text-xl'>
                    <button 
                    className='px-2 pr-4 rounded-md py-1 flex items-center border-2 border-black hover:bg-blue-500'
                    onClick={() => (handleonpagechange('prev'))}
                    >
                        <RiArrowDropLeftLine className='m-0'/> Prev 
                    </button>
                    <p>Page {onpage} of 289</p>
                    <button 
                    className='px-2 pl-4 rounded-md py-1 flex items-center border-2 border-black hover:bg-blue-500' 
                    onClick={() => (handleonpagechange('next'))}
                    >
                        Next <RiArrowDropRightLine className='m-0'/>
                    </button>
                </div>
            
            
            </>
            
            }
        </div>

        <Footer/>
    </>
  )
}

export default Productlist