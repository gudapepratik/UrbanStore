import React, { useEffect, useState } from "react";
import Product from "./Product";
import service from "../appwrite/config";
import { setProducts, setError, setLoading } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  RiArrowDropLeftLine,
  RiArrowDropRightLine,
  RiPlayReverseLine,
} from "@remixicon/react";
import Footer from "./Footer";
import { emptybagimg } from "../assets/asset";
import { useLocation } from "react-router";

function Productlist() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productSlice.products);
  const isloading = useSelector((state) => state.productSlice.isloading);
  const searchKey = useSelector((state) => state.productSlice.key)

  const [onpage, setOnPage] = useState(1);

  // product category
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

  // filter category
  const [filterCategory,setFilterCategory] = useState('')

  // image urls
  const [imageUrls, setImageUrls] = useState([]);

  const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [location])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));
        const category = filterCategory
        console.log("running", onpage);
        const response = await service.getProducts({
          limit: 8,
          onpage: onpage,
          category
        });
        dispatch(setProducts(response.documents));

        // Fetch and resolve image URLs
        const urls = await Promise.all(
          response.documents.map(async (product) => {
            const imageUrl = await service.getImageUrl(product.image[0]);
            return { id: product.$id, url: imageUrl.href }; // Assuming getImageUrl returns { href: 'url' }
          })
        );
        setImageUrls(urls);
        // Set resolved URLs in state
        // const urlMap = {};
        // urls.forEach(item => {
        //     urlMap[item.id] = item.url;
        // });
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [dispatch, onpage,searchKey,filterCategory]);

  const getImageUrl = (id) => {
    const image = imageUrls.find((img) => img.id === id); // Use find instead of filter
    return image ? image.url : null; // Return null if image is not found yet
  };

  const handleonpagechange = (what) => {
    if (what === "next") {
      setOnPage((prev) => prev + 1);
      
    } else {
      setOnPage((prev) => (prev !== 1 ? prev - 1 : prev));
    }
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  };

  return (
    <>
      <div className="container overflow-x-hidden mx-auto p-6">
        {isloading ? (
          <div className="w-full h-screen bg-transparent bg-opacity-5 backdrop-blur-sm flex items-center justify-center">
            <div className="p-8 border-t-transparent border-8 rounded-full border-rose-500 animate-spin "></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full">
              <div className="w-full h-14 flex items-center border-[1px] justify-between border-zinc-400 rounded-md p-2 shadow-inner">
                <div>
                  <label htmlFor="category">Sort: </label>
                  <select 
                  name="category" 
                  id="category" 
                  className="md:px-2 md:py-1 w-28 md:w-fit rounded-md border-[1px] border-zinc-400"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {productCategories.map((cats) => (
                        cats.subCategories.map((subs,key) => (
                          <option key={key} value={subs}>{subs}</option>
                        ))
                    ))}
                  </select>
                </div>
              </div>
              <div className="py-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 gap-6">
                {/* Display the product list */}
                  {products && products.length > 0 && (
                    products.map((product) => (
                      <Product
                        key={product.$id}
                        id={product.$id}
                        title={product.name}
                        price={product.price}
                        imageurl={getImageUrl(product.$id)}
                      />
                    ))
                  )
                }
              </div>
                      </div>
              {products && products.length === 0 && <>
                  {/* Display the empty state when no products are available  */}
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

            <div className="flex w-full items-center justify-around my-12 font-DMSans font-normal text-xl">
              <button
                className="px-2 pr-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("prev")}
              >
                <RiArrowDropLeftLine className="m-0" /> Prev
              </button>
              <p className="text-sm md:text-base">Page {onpage}</p>
              <button
                className="px-2 pl-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-rose-500 text-rose-500 hover:bg-rose-500"
                onClick={() => handleonpagechange("next")}
              >
                Next <RiArrowDropRightLine className="m-0" />
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Productlist;
