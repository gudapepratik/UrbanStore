import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import Loader from '../../Loader/Loader'
import { RiCloseCircleLine } from '@remixicon/react'
import sellerService from '../../../appwrite/sellerconfig'
import { setLoading } from '../../../store/productSlice'

function EditProductModal({productDetails,closeProductModal}) {
    
    // loading state
    const [isloading,setIsLoading] = useState(false)
    
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

    // img preview state
    const [previewImgUrls,setPreviewImgUrls] = useState([])

    // splitted name state
    const [splittedName,setSplittedName] = useState([])

    // product details update state
    const [product,setProduct] = useState({
        brandname: "",
        productname: "",
        description: "",
        price: null,
        stock: null
    })

    // get image urls
    const getPreviewImgUrls =  async () => {
        const urls = await Promise.all(
            productDetails.image.map(async (fileId) => {
                const url = await sellerService.getImageUrl(fileId)
                return url.href
            })
        )
        console.log(urls)

        setPreviewImgUrls(urls)
    }

    useEffect(() => {
        // Split the name
        const splitted = productDetails.name.split("|");
        setSplittedName(splitted)
        
        // set the initial data into product state
        setProduct((prevState) => ({
            ...prevState,
            brandname: splitted.at(0) || "",
            productname: splitted.at(1) || "",
            description: productDetails.description || "",
            price: productDetails.price ?? null,
            stock: productDetails.stock ?? null,
        }));
        
        //call the method Get image URLs
        getPreviewImgUrls();
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

            console.log(product)
            const mergedName = mergeName(product.brandname,product.productname)

            if(product.brandname === splittedName.at(0) && product.productname === splittedName.at(1) && product.description === productDetails.description && Number(product.price) === productDetails.price && Number(product.stock) === productDetails.stock){
                throw new Error("Product details not updated. Please update some fields to reflect changes")
            }

            if(product.brandname === "" || product.productname === "" || product.description === "" || Number(product.price) <= 0 || Number(product.stock) <= 0){
                throw new Error("Product details missing or invalid. Please ensure all the details are filled correctly")
            }

            const updatedProductData = {...product,'name': mergedName}
            console.log(updatedProductData)
            // update the details
            await sellerService.updateProduct({productId: productDetails.$id,updateData: updatedProductData})

            triggerNotification({
                type: "success",
                title: "Details updated",
                message: `Your changes to the product with ID ${productDetails.$id} details have been successfully saved and are now live.`
            })

        } catch(error){
            triggerNotification({
                type: 'danger',
                title: 'Error Occurred',
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
            await sellerService.deleteProduct({documentid: productDetails.$id, imageIds: productDetails.image})

            triggerNotification({
                type: "success",
                title: "Product removed",
                message: `The product has been removed successfully.`
            })
            
        } catch(error){
            triggerNotification({
                type: 'danger',
                title: 'Error Occurred',
                message: `${error.message}`
            })
        } finally{
            setIsLoading(false)
        }
    }

    const mergeName = (brandname,productname) => {
        const mergedName = brandname.concat(" | ",productname)
        return String(mergedName)
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
                                    {new Date(productDetails.$updatedAt).toLocaleString("en-GB", {
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
                                    <h3 className="text-sm w-2/3 text-left">{productDetails.$id}</h3>
                                </div>
                                <div className="w-full flex items-start justify-between py-2">
                                    <label className="text-zinc-700">Product images</label>
                                    <div className='w-2/3 flex flex-wrap gap-1 items-center'>
                                            {
                                                previewImgUrls.map((url,key) => (
                                                    <img key={key} src={url} alt="previewImg" className="md:w-32 md:h-40 w-12 h-20 object-center rounded"/>
                                                    // <input type="file" key={key} name={`image${key}`} className='md:w-20 md:h-28 w-12 h-20  object-center rounded'/>
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
                                        name="brandName" 
                                        className="text-sm w-2/3 font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap" 
                                        defaultValue={product.brandname}
                                        onChange={(e) => handleProductDataInput(e,'brandname')}
                                    ></input>
                                </div>
                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Product Name</label>
                                    <input type="text" 
                                        name="productName" 
                                        className="text-sm w-2/3 font-medium text-left border-b-[1px] border-zinc-500 px-2 focus:outline-none outline-none focus:bg-zinc-200 rounded-md pt-2 text-nowrap" 
                                        defaultValue={product.productname}
                                        onChange={(e) => handleProductDataInput(e,'productname')}
                                    ></input>
                                </div>

                                <div className="w-full flex items-center justify-between border-b-[1px] border-zinc-300 py-2">
                                    <label className="text-zinc-700">Added On</label>
                                    <h3 className="text-sm w-2/3 text-left">
                                        {new Date(productDetails.$createdAt).toLocaleString("en-GB", {
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
                            className='p-3 bg-orange-500 hover:bg-orange-600 transition-all font-DMSans text-white'
                            onClick={handleProductUpdate}
                        >Update Details</button>

                        <button 
                            className='p-3 bg-red-400 transition-all font-DMSans text-white'
                            onClick={handleRemoveProduct}
                            disabled
                        >Remove Product</button>

                    </div>
                </div>
          </div>
      </>
    )
}

export default EditProductModal