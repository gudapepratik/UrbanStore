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
        console.log("running", onpage);
        const response = await service.getProducts({
          limit: 8,
          onpage: onpage,
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
  }, [dispatch, onpage,searchKey]);

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
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-10 gap-6">
  {/* Display the product list */}
  {products && products.length > 0 ? (
    products.map((product) => (
      <Product
        key={product.$id}
        id={product.$id}
        title={product.name}
        price={product.price}
        imageurl={getImageUrl(product.$id)}
      />
    ))
  ) : (
    /* Display the empty state when no products are available */
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
          Looks like you've explored all the products. Time to grab your favorites!
        </h2>
      </div>
    </div>
  )}
</div>


            <div className="flex w-full items-center justify-around my-12 font-DMSans font-normal text-xl">
              <button
                className="px-2 pr-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-blue-700 text-blue-900 hover:bg-blue-700 transition-all"
                onClick={() => handleonpagechange("prev")}
              >
                <RiArrowDropLeftLine className="m-0" /> Prev
              </button>
              <p>Page {onpage} of 289</p>
              <button
                className="px-2 pl-4 rounded-full font-lg hover:text-white py-1 flex items-center border-[1px] border-blue-700 text-blue-900 hover:bg-blue-700"
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
