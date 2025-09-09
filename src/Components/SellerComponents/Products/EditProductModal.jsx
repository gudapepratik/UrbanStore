import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import Loader from '../../Loader/Loader'
import { RiCloseCircleLine } from '@remixicon/react'
import sellerService from '../../../appwrite/sellerconfig'
import { setLoading } from '../../../store/productSlice'
import ProductService from '../../../api/services/products.services'
import { triggerNotification } from '../../../utils/triggerNotification.utils'

function EditProductModal({productDetails,closeProductModal}) {
    
    // loading state
    const [isloading,setIsLoading] = useState(false)

    // product details update state
    const [product,setProduct] = useState({
        brand: "",
        name: "",
        description: "",
        price: null,
        stock: null
    })

    useEffect(() => {
        // set the initial data into product state
        setProduct((prevState) => ({
            ...prevState,
            brand: productDetails.brand || "",
            name: productDetails.name || "",
            description: productDetails.description || "",
            price: productDetails.price ?? null,
            stock: productDetails.stock ?? null,
        }));
    },[productDetails])

    // handle product data to be updated
    const handleProductDataInput = (e,type) => {
        if(type === 'stock' || type === 'price'){
            setProduct((prev) => ({ ...prev, [type]: Number(e.target.value) }))
        } else{
            setProduct((prev) => ({ ...prev, [type]: e.target.value }))
        }
    }

    // handle the prodcut update
    const handleProductUpdate = async () => {
        try{
            // set loading state
            setIsLoading(true)

            if(product.brand === productDetails.brand && product.name === productDetails.name && product.description === productDetails.description && Number(product.price) === productDetails.price && Number(product.stock) === productDetails.stock){
                throw new Error("Product details not updated. Please update some fields to reflect changes")
            }

            if(product.brand === "" || product.name === "" || product.description === "" || Number(product.price) <= 0 || Number(product.stock) <= 0){
                throw new Error("Product details missing or invalid. Please ensure all the details are filled correctly")
            }
            console.log(productDetails)

            // update the details
            await ProductService.updateProductDetails({
                productId: productDetails._id,
                name: product.name,
                brand: product.brand,
                stock: product.stock,
                price: product.price,
                description: product.description
            })

            triggerNotification({
                type: "success",
                title: "Details updated",
                message: `Your changes to the product with ID ${productDetails._id} details have been successfully saved and are now live.`
            })

        } catch(error){
            triggerNotification({
                type: 'danger',
                title: 'Product Update failed!!',
                message: `${error.message}`
            })
        } finally{
            setIsLoading(false)
        }

    }

    // method to remove the product
    const handleRemoveProduct = async () => {
        try{
            // set loading state
            setLoading(true)

            // method to delete the document from products collection
            await ProductService.deleteProductById(productDetails._id)

            triggerNotification({
                type: "success",
                title: "Product removed",
                message: `The product has been removed successfully.`
            })
            
        } catch(error){
            triggerNotification({
                type: 'danger',
                title: 'Product delete failed !!!',
                message: `${error.message}`
            })
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="fixed flex justify-center items-center w-full h-full top-0 left-0 bg-black bg-opacity-50 backdrop-blur-sm z-50">
                {/* notification component */}
                <ReactNotifications />

                {/* loading componenet  */}
                {isloading && <Loader/>}

                <div className="bg-white gap-2 p-6 shadow-lg w-[75vw] min-h-fit font-DMSans Container flex flex-col rounded-md selection:bg-zinc-700 selection:text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-end gap-3">
                            <h2 className="text-3xl font-bold">Edit Product</h2>
                            <div className="flex gap-2 items-center">
                                <label className="font-light text-xs">Last updated on:</label>
                                <p className="text-sm font-medium">
                                    {new Date(productDetails.updatedAt).toLocaleString("en-GB", {
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
                        onClick={closeProductModal}
                        className=" text-zinc-700 p-2 rounded-full"
                        >
                            <RiCloseCircleLine size={30}/>
                        </button>
                    </div>

                    <div className="w-full flex justify-between gap-2 font-DMSans ">
                        {/* left section */}
                        <div className="flex w-1/2 flex-col p-3 border-[1px] border-zinc-300 text-zinc-900">
                            <label className="w-full border-b-[1px] border-zinc-300 pb-2 font-medium">Order Details</label>
                            <div className="flex w-full flex-col gap-2">
                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Product ID</label>
                                    <h3 className="text-sm w-2/3 text-left">{productDetails._id}</h3>
                                </div>
                                <div className="w-full flex items-start justify-between py-2">
                                    <label className="text-zinc-700">Product images</label>
                                    <div className='w-2/3 flex flex-wrap gap-1 items-center'>
                                            {
                                                productDetails.imageUrls.map((image,key) => (
                                                    <img key={key} src={image.publicUrl} alt="previewImg" className="md:w-32 md:h-40 w-12 h-20 object-center rounded"/>
                                                ))
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-1/2 flex-col p-3 border-[1px] border-zinc-300 text-zinc-900">
                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Brand Name</label>
                                    <input 
                                        type="text" 
                                        name="brand" 
                                        className="text-sm w-2/3 font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap" 
                                        defaultValue={product.brand}
                                        onChange={(e) => handleProductDataInput(e,'brand')}
                                    ></input>
                                </div>
                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Product Name</label>
                                    <input type="text" 
                                        name="name" 
                                        className="text-sm w-2/3 font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap" 
                                        defaultValue={product.name}
                                        onChange={(e) => handleProductDataInput(e,'name')}
                                    ></input>
                                </div>

                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Added On</label>
                                    <h3 className="text-sm w-2/3 text-left">
                                        {new Date(productDetails.createdAt).toLocaleString("en-GB", {
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
                                    <label className="text-zinc-700">Category</label>
                                    <h3 className="text-sm w-2/3 text-left">{productDetails.category}</h3>
                                </div>

                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Description</label>
                                    <textarea 
                                        name="productDescription" 
                                        className='text-sm w-2/3 text-left min-h-32 max-h-32 whitespace-pre-wrap overflow-y-scroll scrollbar-hide border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap' 
                                        defaultValue={product.description}
                                        onChange={(e) => handleProductDataInput(e,'description')}
                                        ></textarea>
                                </div>

                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Price</label>
                                    <div className='w-2/3 flex items-end gap-1'>
                                        <label >₹</label>
                                        <input 
                                            type="number" 
                                            name="productPrice" 
                                            className="text-sm font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap" 
                                            defaultValue={product.price}
                                            min={1}
                                            onChange={(e) => handleProductDataInput(e,'price')}
                                        ></input>
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-between pt-2">
                                    <label className="text-zinc-700">Current Stock</label>
                                    <input 
                                        type="number" 
                                        name="productStock" 
                                        className="text-sm w-2/3 font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap " 
                                        defaultValue={product.stock}
                                        min={1}
                                        onChange={(e) => handleProductDataInput(e,'stock')}
                                    ></input>
                                </div>
                        </div>
                    </div>
                    <div className='w-full flex gap-1'>
                        <button 
                            className='p-3 bg-orange-500 transition-all hover:bg-orange-600 font-DMSans text-white'
                            onClick={handleProductUpdate}
                            // disabled // temporarily disabled
                        >Update Details</button>

                        <button 
                            className='p-3 bg-red-500 transition-all hover:bg-red-600 font-DMSans text-white'
                            onClick={handleRemoveProduct}
                            // disabled // temporarily disabled
                        >Remove Product</button>

                    </div>
                </div>
          </div>
      </>
    )
}

export default EditProductModal