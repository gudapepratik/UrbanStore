import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { useSelector } from 'react-redux'
import sellerService  from '../../../appwrite/sellerconfig'
import EditOrderModal from './EditOrderModal'
import Loader from '../../Loader/Loader'
import { RiRefreshLine } from '@remixicon/react'

function SellerOrders() {
    
    // loading state
    const [isloading,setIsLoading] = useState(false)

    // reload state
    const [reloader,setReloader] = useState(false)

    // state to store the selected filter
    const [filterCategory,setFilterCategory] = useState('allorders')

    // orders state to store the fetched orders
    const [Orders,setOrders] = useState([])

    // current logged in user's userData
    const userData = useSelector(state => state.authSlice.userData)

    // edit order modal state
    const [showEditModal,setShowEditModal] = useState(false)

    // state to store the order details of current order to edit
    const [editOrderDetails,setEditOrderDetails] = useState({})

    // close edit modal handler
    const CloseEditModal = () => setShowEditModal(false)

    // update details trigger state
    const [updateDetails,setUpdateDetails] = useState(prev => !prev)

    // helper function to set the orders details to edit and set the showEditModal state
    const showEditModalHelper = (orderDetails) => {
        setShowEditModal(true)
        setEditOrderDetails(orderDetails)
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

    const fetchOrders = async () => {
        try{
            setIsLoading(true)
            console.log(userData.$id)
            // get the orders from the orders collection
            const orderResponse = await sellerService.getOrders({sellerId: userData.$id, filterCategory: filterCategory})

            // get the product details from products collection
            const orderData = await Promise.all(
                orderResponse.documents.map(async (order) => {
                    const product =  await sellerService.getSingleProduct(order.product_id)
                    const previewImgUrl = await sellerService.getImageUrl(product.image.at(0))
                    return {
                        'order_id': order.$id,
                        'product_id': order.product_id,
                        'customer_id': order.customer_id,
                        'State': order.State,
                        'price': order.price,
                        'product_category': product.category,
                        'previewImgUrl': previewImgUrl.href,
                        'product_name':product.name,
                        'product_stock': product.stock,
                        'quantity_ordered': order.quantity,
                        'address': order.address,
                        'paymentMethod': order.paymentMethod,
                        'order_datetime': order.$createdAt,
                        'expected_delivery_date': order.expected_delivery_date,
                        'last_updated_on': order.$updatedAt,
                    }
                })
            )

            setOrders(orderData)
            console.log(orderData)
            
        } catch(error){
            triggerNotification({
                type: 'danger',
                title: 'Unknown Error Occurred',
                message: `${error.message}`
            })
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    },[filterCategory,userData,updateDetails,reloader])


    return (
        <>
            <div className='w-[calc(100vw-300px)] flex p-3  flex-col gap-3'>
                {isloading && <Loader/>}
                {showEditModal && <EditOrderModal CloseEditModal={CloseEditModal} orderDetails={editOrderDetails} updateDetailsTrigger={setUpdateDetails}/>}
                {/*top filter section  */}
                <div className='w-full flex justify-between px-10 py-3 rounded-md bg-zinc-100 shadow-inner border-[1px] border-zinc-400'>
                    <div className='flex items-center gap-3'>
                        <h3 className='font-DMSans font-medium text-lg text-zinc-900'>filter: </h3>
                        <select 
                        name="Category" 
                        className='p-2 rounded-md shadow-inner border-[1px] border-zinc-800 text-zinc-900 focus:outline-none cursor-pointer'
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        >
                        <option value={'allorders'} className='font-DMSans'>AllOrders</option>
                        <option value={'placed'} className='font-DMSans'>Placed</option>
                        <option value={'shipped'} className='font-DMSans'>Shipped</option>
                        <option value={'delivered'} className='font-DMSans'>Delivered</option>
                        <option value={'cancelled'} className='font-DMSans'>Cancelled</option>
                        </select>
                    </div>
                    <div className='flex'>
                    <button className='flex gap-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md shadow-inner'
                    onClick={() => setReloader(prev => !prev)}
                    ><RiRefreshLine/>Reload</button>
                    </div>
                </div>

                {/* products table  */}
                <div className="border border-zinc-400 rounded-md w-full">
                <div className="overflow-x-auto h-[calc(100vh-13rem)] overflow-y-scroll">
                    <table className="min-w-full bg-white font-DMSans shadow-inner rounded">
                    <thead className=' sticky top-0 bg-white'>
                        <tr>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[150px] text-left">Order ID</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[180px] text-left">Date Ordered</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[180px] text-left">Target Date</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[120px] text-left">Status</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[200px] text-left">Customer ID</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[400px] text-left">Product</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[100px] text-left">Quantity</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[150px] text-left">Order Total</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[100px] text-left">Payment</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[300px] text-left">Delivery Address</th>
                        <th className="py-2 px-4 text-gray-700 font-semibold min-w-[200px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Orders && Orders.length > 0 ? (
                        Orders.map((order, key) => (
                            <tr key={key} className="border-b border-gray-200">
                            <td className="p-3 text-sm text-gray-800">{order.order_id}</td>
                            <td className="p-3  text-sm text-gray-800">
                                {new Date(order.order_datetime).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                })}
                            </td>
                            <td className="p-3  text-sm text-gray-800">
                                {new Date(order.expected_delivery_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                })}
                            </td>
                            <td className={`p-3 text-sm font-medium ${order.State === 'placed' && 'text-blue-600'} ${order.State === 'shipped' && 'text-orange-500'} ${order.State === 'delivered' && 'text-green-500'} ${order.State === 'cancelled' && 'text-red-500'}`}>{order.State}</td>
                            <td className="p-3 text-sm text-gray-800">{order.customer_id}</td>
                            <td className="p-3 text-sm text-gray-800 flex items-center gap-2">
                                <img
                                src={order.previewImgUrl}
                                alt="Product"
                                className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                <p>{order.product_name}</p>
                                <p className="text-gray-500 text-sm">{order.product_category}</p>
                                </div>
                            </td>
                            <td className="p-3 text-base px-8 text-gray-800">{order.quantity_ordered}</td>
                            <td className="p-3 text-sm  text-gray-800">₹{order.price*order.quantity_ordered}</td>
                            <td className="p-3 text-sm text-gray-800">{order.paymentMethod}</td>
                            <td className="p-3 text-sm  text-gray-800">
                                <p>{order.address}</p>
                            </td>
                            <td className="p-3 text-center text-gray-800">
                                {order.State === 'placed' && 
                                    <>
                                        <button
                                        className="bg-green-500 text-white px-3 mx-1 py-1 rounded-md text-sm"
                                        onClick={() => showEditModalHelper(order)}
                                        >
                                        Edit
                                        </button>
                                        <button
                                        className="bg-red-500 text-white px-3 py-1 mx-1 rounded-md text-sm"
                                        onClick={() => cancelOrder(order.order_id)}
                                        >
                                        Cancel
                                        </button>
                                    </>
                                }

                                {order.State === 'shipped' &&
                                <>
                                    <button
                                        className="bg-green-500 text-white px-3 mx-1 py-1 rounded-md text-sm"
                                        onClick={() => showEditModalHelper(order)}
                                    >
                                        Edit
                                    </button>
                                </>
                                }
                                
                                {order.State === 'delivered' &&
                                <>
                                    <button
                                    className="bg-green-500 text-white px-3 mx-1 py-1 rounded-md text-sm"
                                    onClick={() => showEditModalHelper(order)}
                                    >
                                    View Details
                                    </button>
                                </>
                                }  
                                
                                {order.State === 'cancelled' &&
                                <>
                                    <button
                                    className="bg-red-500 text-white px-3 mx-1 py-1 rounded-md text-sm"
                                    onClick={() => showEditModalHelper(order)}
                                    >
                                    View Details
                                    </button>
                                </>
                                }   
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td
                            colSpan="13"
                            className="p-3 text-center font-DMSans text-gray-500"
                            >
                            No Order History
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

export default SellerOrders