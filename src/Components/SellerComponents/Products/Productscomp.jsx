import { RiAddCircleLine } from '@remixicon/react'
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

function Productscomp() {

    // product categories
    const productCategories = [
        { 
          category: 'Apparel & Accessories', 
          subCategories: [
            'All products',
            'Men’s Clothing', 
            'Women’s Clothing', 
            'Kids\' Clothing', 
            'Footwear', 
            'Bags & Luggage', 
            'Jewelry & Accessories'
          ] 
        },
        { 
          category: 'Electronics', 
          subCategories: [
            'Mobile Phones & Tablets', 
            'Computers & Laptops', 
            'Cameras & Photography', 
            'Audio & Headphones', 
            'Wearable Tech', 
            'Home Appliances'
          ] 
        },
        { 
          category: 'Home & Living', 
          subCategories: [
            'Furniture', 
            'Kitchenware', 
            'Bedding & Mattresses', 
            'Home Decor', 
            'Storage & Organization', 
            'Lighting'
          ] 
        },
        { 
          category: 'Beauty & Personal Care', 
          subCategories: [
            'Skincare', 
            'Makeup', 
            'Hair Care', 
            'Fragrances', 
            'Health Supplements', 
            'Personal Hygiene'
          ] 
        },
        { 
          category: 'Sports & Outdoors', 
          subCategories: [
            'Sports Equipment', 
            'Outdoor Gear', 
            'Camping & Hiking', 
            'Exercise & Fitness', 
            'Sportswear'
          ] 
        },
        { 
          category: 'Books & Stationery', 
          subCategories: [
            'Fiction & Non-fiction Books', 
            'Educational & Reference Books', 
            'Magazines & Comics', 
            'Office Supplies', 
            'Art & Craft Supplies'
          ] 
        },
        { 
          category: 'Toys & Baby Products', 
          subCategories: [
            'Toys & Games', 
            'Baby Clothing', 
            'Strollers & Car Seats', 
            'Diapers & Baby Care'
          ] 
        },
        { 
          category: 'Food & Beverages', 
          subCategories: [
            'Snacks & Packaged Foods', 
            'Beverages', 
            'Condiments & Spices', 
            'Fresh Produce', 
            'Organic & Health Foods'
          ] 
        },
        { 
          category: 'Health & Wellness', 
          subCategories: [
            'Supplements & Vitamins', 
            'Fitness Equipment', 
            'Wellness Gadgets', 
            'First Aid & Medical Supplies'
          ] 
        },
        { 
          category: 'Automotive', 
          subCategories: [
            'Car Accessories', 
            'Bike Accessories', 
            'Car Care Products', 
            'Replacement Parts'
          ] 
        },
        { 
          category: 'Pet Supplies', 
          subCategories: [
            'Pet Food', 
            'Pet Accessories', 
            'Pet Grooming', 
            'Pet Toys'
          ] 
        },
        { 
          category: 'Grocery Essentials', 
          subCategories: [
            'Household Cleaning Supplies', 
            'Paper Products', 
            'Laundry Supplies'
          ] 
        },
        { 
          category: 'Garden & Outdoor Living', 
          subCategories: [
            'Garden Tools', 
            'Plants & Seeds', 
            'Outdoor Furniture', 
            'Barbecue & Grill Supplies'
          ] 
        }
      ]

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

    // category to filter
    const [filterCategory,setFilterCategory] = useState("")
    
    // states to handle Add product component (Modal) renders
    const [addProductModal,setAddProductModal] = useState(false)
    const CloseAddProductModal = () => setAddProductModal(false)

    // products state
    const [products,setProducts] = useState([])

    // image urls to preview
    const [imageurls,setImageUrls] = useState([])

    // current logged in user's userData
    const userData = useSelector(state => state.authSlice.userData)

    useEffect(() => {
      const fetchData = async () => {
        try{
          setIsLoading(true)
          let category = filterCategory
          if(category === 'All products'){
            category = ''
          }
          const produtsres = await sellerService.getProducts(userData.$id,category)
          console.log(produtsres)
          setProducts(produtsres.documents)

          const imageurls = await Promise.all(
            produtsres.documents.map(async (doc) => {
              const url = await sellerService.getImageUrl(doc.image[0])
              return url.href
            })
          )
          console.log(imageurls)
          setImageUrls(imageurls)
        } catch(error){
          Store.addNotification({
            ...notification,
            type: "danger",
            title: "Error while fetching products",
            message: `${error.message}`,
            container: 'top-right',
            dismiss: {
              duration: 2000,
              pauseOnHover: true
            }
          })
        } finally{
          setIsLoading(false)
        }
      }
      fetchData()
    },[filterCategory])


      
  return (
    <>
        <div className='flex w-full p-3  flex-col gap-3'>

          {/* loading state  */}
          {isloading && <Loader/>}

          {/* Add product Modal COmponent  */}
          {addProductModal && <AddProduct CloseModal={CloseAddProductModal}/>}

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
                        {productCategories.map((item) => (
                            item.subCategories.map((subs,key) => (
                                <option key={key} value={subs} className='font-DMSans'>{subs}</option>
                            ))
                        ))}
                    </select>
                </div>

                <div>
                    <button className='flex gap-2 bg-[#00B75F] text-white p-2 rounded-md shadow-inner'
                    onClick={() => setAddProductModal(true)}
                    ><RiAddCircleLine/> Add Product</button>
                </div>

            </div>
            
            {/* products table  */}
            <div className='w-full border-[1px] border-zinc-400 rounded-md'>
                <table className='min-w-full bg-white font-DMSans shadow-inner rounded overflow-x-scroll'>
                    <thead>
                        <tr>
                            <th className="py-2 px-4 text-gray-700 font-semibold font-DMSans">Product Name</th>
                            <th className="py-2 px-4 text-gray-700 font-semibold font-DMSans">Category</th>
                            <th className="py-2 px-4 text-gray-700 font-semibold font-DMSans">Price</th>
                            <th className="py-2 px-4 text-gray-700 font-semibold font-DMSans">Stock</th>
                            <th className="py-2 px-4 text-gray-700 font-semibold font-DMSans">Added On</th>
                        </tr> 
                    </thead>

                    <tbody>
                        {products && products.length > 0 ? (
                            products.map((product,key) => (
                            <tr key={product.$id} className="border-b border-gray-200">
                                <td className="p-3 text-gray-800 flex gap-2 items-center">
                                  <div>
                                      <img src={imageurls.at(key)} alt="image preview" className='w-12 h-16 shadow-inner rounded-sm object-cover'/>
                                  </div>
                                  <p>{product.name}</p>
                                </td>
                                <td className="p-3 text-gray-800">{product.category}</td>
                                <td className="p-3 text-gray-800 text-right">₹{product.price}</td>
                                <td className="p-3 text-gray-800 text-right">{product.stock}</td>
                                <td className="p-3 text-gray-800">{format(new Date(product.created_at), "do MMMM yyyy, hh:mm a")}</td>
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
    </>
  )
}

export default Productscomp