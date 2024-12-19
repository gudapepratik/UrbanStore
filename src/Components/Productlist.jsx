import React, { useEffect, useState } from "react";
import Product from "./Product";
import service from "../appwrite/config";
import { setProducts, setLoading, setPage,setFilter } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
  RiPlayReverseLine,
} from "@remixicon/react";
import Footer from "./Footer";
import { emptybagimg } from "../assets/asset";
import { useLocation } from "react-router";
import ProductPageSkeleton from "./ProductPageSkeleton";
import Loader from "./Loader/Loader";
import { ReactNotifications, Store } from "react-notifications-component";
import Filter from "./FilterCategory/Filter";

function Productlist() {
  // dispatcher to handle redux changes
  const dispatch = useDispatch();

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

  // product state to store the products
  const [products,setProducts] = useState([])

  // OnPage redux state from product slice to handle page changes
  const onPage = useSelector((state) => state.productSlice.onPage)

  // product categories
  const productCategories = [
    { 
      category: 'Apparel & Accessories', 
      subCategories: [
        'All Products',
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

  // filter state from product slice to handle filter categories
  const filter = useSelector((state) => state.productSlice.filter)

  // state to scroll to top on page changes
  const location = useLocation()

  // loading state
  const [isloading,setIsLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])

  // method to fetch products
  const fetchProducts = async () => {
    try {
      // backend call to fetch products
      const response = await service.getProducts({
        limit: 8,
        onpage: onPage,
        categories: filter
      });

      // set the product in local state
      setProducts(response.documents)

      // scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {
      triggerNotification({
        type: "danger",
        title: "Unknown Error Occurred",
        message: `${error.message}`
      })
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [dispatch, onPage,filter]);

  // method to handle filter change
  const changeFilter = (filter) => {
    dispatch(setFilter(filter))
  }

  // method to handle page change
  const handleonpagechange = (action) => {
    if (action === "next") {
      dispatch(setPage('next'))
    } else {
      dispatch(setPage('prev'))
    }
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  };

  return (
    <>
      {/* Notification component  */}
      <ReactNotifications/>
      {isloading && <Loader/>}
      <div className="container overflow-x-hidden mx-auto p-6">
            {/* Filter category box  */}
            <div className="flex flex-col w-full">
              <div className="w-full h-14 flex items-center border-[1px] justify-between border-zinc-400 rounded-md p-2 shadow-inner">
                <div className="flex gap-3 items-center">
                  <label htmlFor="category">Sort: </label>
                  {/* <select 
                  name="category" 
                  id="category" 
                  className="md:px-2 md:py-1 w-28 md:w-fit rounded-md border-[1px] border-zinc-400 p-2  shadow-inner  text-zinc-900 focus:outline-none cursor-pointer"
                  value={filter}
                  onChange={(e) => changeFilter(e.target.value)}
                  >
                    {productCategories.map((cats) => (
                        cats.subCategories.map((subs,key) => (
                          <option key={key} value={subs}>{subs}</option>
                        ))
                    ))}
                  </select> */}
                  <Filter/>
                </div>
              </div>
            </div>

            {/* Display the product list */}
              <div className="py-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 gap-6">
                  {products && products.length > 0 && (
                      products.map((product,index) => (
                        <Product key={index} productId={product.$id}/>
                      ))
                    )
                  }
              </div>

              {/* Display the empty state when no products are available  */}
              {products && products.length === 0 && 
                <>
                    <div className="w-full col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center py-16">
                      <div className="flex flex-col items-center justify-center max-w-md text-center">
                          <img
                            src={emptybagimg}
                            alt="empty bag"
                            className="w-32 h-32 mb-4"
                          />
                          <h1 className="font-DMSans font-bold text-xl text-zinc-800 selection:bg-rose-500 selection:text-white">
                            No more items to show
                          </h1>
                          <h2 className="font-DMSans font-normal text-zinc-400 mt-2 selection:bg-rose-500 selection:text-white">
                            Looks like you&apos;ve explored all the products. Time to grab your favorites!
                          </h2>
                      </div>
                    </div>
                </>
              }

            {/* page navigator buttons  */}
            <div className="flex w-full items-center justify-around my-12 font-DMSans font-normal text-xl">
              {/* previous button  */}
              <button
                className="px-2 pr-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("prev")}
              >
                <RiArrowDropLeftLine className="m-0" /> Prev
              </button>

              {/* page number */}
              <p className="text-sm md:text-base">Page {onPage}</p>

              {/* next button  */}
              <button
                className="px-2 pl-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("next")}
              >
                Next <RiArrowDropRightLine className="m-0" />
              </button>

            </div>
          
      </div>
      
      {/* Footer component  */}
      <Footer />
    </>
  );
}

export default Productlist;
