import { RiAddCircleLine, RiRefreshLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import AddProduct from '../../../Components/SellerComponents/Products/AddProduct.jsx'
import { useSelector } from 'react-redux'
// library to transform the Date into readable format
import {format} from 'date-fns'
// import this in the components 
import { ReactNotifications, Store } from 'react-notifications-component' // react notification component and Store to trigger the notifications
import 'react-notifications-component/dist/theme.css' // react notification css theme
import 'animate.css/animate.min.css' // react notification animation class
import Loader from '../../../Components/Loader/Loader.jsx'
import EditProductModal from '../../../Components/SellerComponents/Products/EditProductModal.jsx'
import ProductService from '../../../api/services/products.services.js'
import { triggerNotification } from '../../../utils/triggerNotification.utils.js'

function Productscomp() {

    // product categories
    const productCategories = useSelector(state => state.productSlice.filterCategories)

    // loading state
    const [isloading,setIsLoading] = useState(false)

    // reload state
    const [reloader,setReloader] = useState(true)

    // category to filter
    const [filterCategory,setFilterCategory] = useState('All Products')
    
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

    useEffect(() => {
      const fetchData = async () => {
        try{
          setIsLoading(true)
          const produtsres = await ProductService.getProductsBySeller({page: 1, limit: 10, categories: filterCategory})
          // console.log(produtsres.data.data.products)
          setProducts(produtsres.data.data.products)
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
                      <option value="All Products" className="font-DMSans">All Products</option>
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
                                src={product.imageUrls.at(0).publicUrl}
                                alt="Product"
                                className="w-14 h-16 object-contain rounded"
                                />
                                <div>
                                <p>{product.brand + ' | ' + product.name}</p>
                                </div>
                            </td>
                            <td className="p-3 text-gray-800">{product.category}</td>
                            <td className="p-3 text-gray-800 text-left">₹{product.price}</td>
                            <td className="p-3 text-gray-800 text-left">{product.stock}</td>
                            <td className="p-3 text-gray-800">{format(new Date(product.createdAt), "do MMMM yyyy, hh:mm a")}</td>
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