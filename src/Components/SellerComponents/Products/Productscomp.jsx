import { RiAddCircleLine, RiRefreshLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AddProduct from './AddProduct'
import { useSelector } from 'react-redux'
import  sellerService  from '../../../appwrite/sellerconfig'
// library to transform the Date into readable format
import {format} from 'date-fns'
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import Loader from '../../Loader/Loader'
import EditProductModal from './EditProductModal'

function Productscomp() {

    // product categories
    const productCategories = useSelector(state => state.productSlice.filterCategories)

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

    // loading state
    const [isloading,setIsLoading] = useState(false)

    // reload state
    const [reloader,setReloader] = useState(true)

    // category to filter
    const [filterCategory,setFilterCategory] = useState("All Products")
    
    // states to handle Add product component (Modal) renders
    const [addProductModal,setAddProductModal] = useState(false)
    const CloseAddProductModal = () => setAddProductModal(false)

    // products state
    const [products,setProducts] = useState([])

    // current logged in user's userData
    const userData = useSelector(state => state.authSlice.userData)

    // edit order modal state
    const [showEditProductModal,setShowEditProductModal] = useState(false)

    // state to store the order details of current order to edit
    const [editProductDetails,setEditProductDetails] = useState({})

    // close edit modal handler
    const CloseEditProductModal = () => setShowEditProductModal(false)

    // product modal helper
    const showEditProductModalHelper = (product) => {
      setEditProductDetails(product)
      setShowEditProductModal(true)
    }

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

    useEffect(() => {
      const fetchData = async () => {
        try{
          setIsLoading(true)
          const produtsres = await sellerService.getProducts({sellerid: userData.$id,category: filterCategory})

          const productData = await Promise.all(
            produtsres.documents.map(async (doc) => {
              const url = await sellerService.getImageUrl(doc.image[0])
              return {
                ...doc,
                "previewImgUrl": url.href
              }
            })
          )

          setProducts(productData)
        } catch(error){
          triggerNotification({
            type: 'danger',
            title: 'Error While fetching data',
            message: `${error.message}`
          })
        } finally{
          setIsLoading(false)
        }
      }
      fetchData()
    },[filterCategory, reloader])

  return (
    <>
        <div className='flex w-full p-3  flex-col gap-3'>

          {/* loading state  */}
          {isloading && <Loader/>}

          {/* Add product Modal Component  */}
          {addProductModal && <AddProduct CloseModal={CloseAddProductModal}/>}

          {/* Edit product Modal component  */}
          {showEditProductModal && <EditProductModal productDetails={editProductDetails} closeProductModal={CloseEditProductModal}/>}

          {/* top section  */}
          <div className='w-full flex justify-between px-10 py-3 rounded-md bg-zinc-100 shadow-inner border-[1px] border-zinc-400'>
            <div className='flex items-center gap-3'>
                    <h3 className='font-DMSans font-medium'>Sort by: </h3>
                    <select 
                    name="Category" 
                    id="Category" 
                    className='p-2 rounded-md shadow-inner'
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {Object.entries(productCategories.men).map(([category, items]) => (
                                items.map((item,key) => (
                                  <option key={key} value={item} className="font-DMSans">
                                  {item}
                                </option>
                                ))
                        ))}
                        {Object.entries(productCategories.women).map(([category, items]) => (
                                      items.map((item,key) => (
                                        <option key={key} value={item} className="font-DMSans">
                                        {item}
                                      </option>
                                      ))
                          ))}
                          {Object.entries(productCategories.unisex).map(([category, items]) => (
                                        items.map((item,key) => (
                                          <option key={key} value={item} className="font-DMSans">
                                          {item}
                                        </option>
                                        ))
                            ))}
                    </select>
            </div>
            <div className='flex gap-2'>
                    <button className='flex gap-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md shadow-inner'
                    onClick={() => setReloader(prev => !prev)}
                    ><RiRefreshLine/>Reload</button>
                    <button className='flex gap-2 bg-[#00B75F] hover:bg-[#00ad5a] text-white p-2 rounded-md shadow-inner'
                    onClick={() => setAddProductModal(true)}
                    ><RiAddCircleLine/> Add Product</button>
            </div>
          </div>
            
          {/* products table  */}
          <div className="border border-zinc-400 rounded-md w-full">
            <div className="overflow-x-auto h-[calc(100vh-13rem)] overflow-y-scroll">
              <table className="min-w-full bg-white font-DMSans shadow-inner rounded">
                <thead className=' sticky top-0 bg-white'>
                  <tr>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[400px] text-left">Product Name</th>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[200px] text-left font-DMSans">Category</th>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[100px] text-left font-DMSans">Price</th>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[100px] text-left font-DMSans">Stock</th>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[250px] text-left font-DMSans">Added On</th>
                    <th className="py-2 px-4 text-gray-700 font-semibold w-[200px] text-left font-DMSans">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                      products.map((product,key) => (
                        <tr key={key} className="border-b border-gray-200 text-sm">
                            <td className="p-3 text-sm text-gray-800 flex items-center gap-2">
                                <img
                                src={product.previewImgUrl}
                                alt="Product"
                                className="w-14 h-16 object-contain rounded"
                                />
                                <div>
                                <p>{product.name}</p>
                                </div>
                            </td>
                            <td className="p-3 text-gray-800">{product.category}</td>
                            <td className="p-3 text-gray-800 text-left">₹{product.price}</td>
                            <td className="p-3 text-gray-800 text-left">{product.stock}</td>
                            <td className="p-3 text-gray-800">{format(new Date(product.created_at), "do MMMM yyyy, hh:mm a")}</td>
                            <td className="p-3 text-gray-800">
                              <button
                                className="bg-green-500 text-white px-3 mx-1 py-1 rounded-md text-sm"
                                onClick={() => showEditProductModalHelper(product)}
                              >
                                Edit Product
                              </button>
                            </td>
                        </tr>
                      ))            
                    ) : (
                              <tr>
                              <td colSpan="5" className="p-3 text-center font-DMSans text-gray-500">
                                  No products available
                              </td>
                              </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  )
}

export default Productscomp