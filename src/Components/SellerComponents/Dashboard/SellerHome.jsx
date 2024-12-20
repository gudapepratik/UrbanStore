import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function SellerHome() {
    const userData = useSelector(state => state.authSlice?.userData)
    const userStatus = useSelector(state => state.authSlice?.status)


    return (
        <>
            <div className='w-full bg-[#F3F4F6] flex flex-col gap-3 items-center'>
                <div className="p-6 flex flex-col items-center gap-1 bg-[#F3F4F6] w-full">
                    {!userStatus && (
                        <h1 className="text-4xl font-extrabold font-DMSans text-zinc-800 ">
                            Welcome to UrbanStore<span className='text-[#00B75F] text-lg'>Business</span>
                        </h1>
                    )}
                    {userStatus && (
                        <h1 className="text-4xl font-extrabold font-DMSans text-zinc-800 ">
                            Welcome, <span className='text-[#009e50]'>{userData?.name}</span>
                        </h1>
                    )}
                    <p className="text-zinc-800 font-DMSans text-xl">
                        Manage your products, orders, and settings seamlessly. Let’s grow your business together!
                    </p>    
                </div>

                {/* services we offer section  */}
                <div className="flex items-start px-10 py-3 flex-col font-DMSans">
                    <h2 className="text-3xl font-bold text-[#009e50]">Services We Offer</h2>
                    <p className="text-zinc-600 text-lg mb-6">
                        At UrbanStore, we provide tools and services to help you efficiently manage and grow your business.
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className=" bg-zinc-200 bg-opacity-80 text-zinc-800 backdrop-blur-sm hover:text-white rounded-md p-4 hover:bg-[#009e50] shadow-lg transition-all">
                            <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                            <p className="text-sm">
                                Add, edit, and manage your product listings effortlessly.
                            </p>
                        </div>
                        <div className="bg-zinc-200 bg-opacity-80 text-zinc-800 backdrop-blur-sm hover:text-white rounded-md p-4 hover:bg-orange-400 shadow-lg transition-all">
                            <h3 className="text-lg font-semibold mb-2">Order Tracking</h3>
                            <p className="text-sm">
                                View and track all your orders in one place.
                            </p>
                        </div>
                        <div className="bg-zinc-200 bg-opacity-80 text-zinc-800 backdrop-blur-sm hover:text-white rounded-md p-4 hover:bg-[#165ac7] shadow-lg transition-all">
                            <h3 className="text-lg font-semibold mb-2">Inventory Management</h3>
                            <p className="text-sm">
                                Keep your stock updated and never miss a sale.
                            </p>
                        </div>
                        <div className="bg-zinc-200 bg-opacity-80 text-zinc-800 backdrop-blur-sm hover:text-white rounded-md p-4 hover:bg-[#b01a45] shadow-lg transition-all">
                            <h3 className="text-lg font-semibold mb-2">Store Customization</h3>
                            <p className="text-sm">
                                Update your store details to attract more customers.
                            </p>
                        </div>
                    </div>
                </div>

                
                {/* support section  */}
                <div className="mt-3 bg-[#F9FAFB] p-4 rounded-md shadow-lg flex flex-col gap-1 font-DMSans">
                    <h2 className="text-xl font-semibold text-zinc-800 ">Need Help?</h2>
                    <p className="text-zinc-600 text-base mb-4">
                        Our support team is here to help you with any issues or queries.  
                    </p>
                    <button className="bg-[#00B75F] w-fit text-white text-sm px-6 py-2 rounded-md hover:bg-[#009e50]">
                        Contact Support
                    </button>
                </div>
            </div>
        </>
    )
}

export default SellerHome