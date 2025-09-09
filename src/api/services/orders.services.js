import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js"
import ErrorHandler from "../../utils/ErrorHandler.utils.js";
import Razorpay from "razorpay";
import { triggerNotification } from "../../utils/triggerNotification.utils.js";
import conf from "../../conf/conf.js";

class OrderService{

    async processPayment({ paymentMethod, address, orders, totalAmount, notes, couponInfo }) {
        try {
            if (!paymentMethod || !address || !orders || !totalAmount) 
                throw new Error("Insufficient data to place order!!");
    
            let orderDetails;
            
            if (paymentMethod.toLowerCase() === 'cashondelivery') {
                orderDetails = await httpClient.post(`${API_ENDPOINTS.ORDERS}/place-order`, {
                    orders,
                    paymentMethod,
                    totalAmount,
                    address,
                    couponInfo
                });
                return orderDetails;  // Return immediately for COD
            }
    
            // Create an order for Razorpay
            const createOrderResponse = await httpClient.post(`${API_ENDPOINTS.ORDERS}/create-order`, {
                amount: totalAmount,
                currency: 'INR',
                notes
            });
    
            console.log(createOrderResponse);
    
            const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.onload = () => resolve(true);
                    script.onerror = () => reject(false);
                    document.body.appendChild(script);
                });
            };
    
            const razorpayLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
            if (!razorpayLoaded) {
                throw new Error("Razorpay SDK failed to load. Check your internet connection.");
            }
    
            return new Promise((resolve, reject) => {
                var options = {
                    "key": conf.razorpayKeyId,
                    "amount": createOrderResponse.data.data.amount,
                    "currency": "INR",
                    "name": "UrbanStore",
                    "description": "Test Transaction",
                    "order_id": createOrderResponse.data.data.id,
                    "handler": async function (response) {
                        try {
                            const verifyResponse = await httpClient.post(`${API_ENDPOINTS.ORDERS}/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
    
                            // Place the order after successful payment
                            orderDetails = await httpClient.post(`${API_ENDPOINTS.ORDERS}/place-order`, {
                                orders,
                                paymentMethod,
                                totalAmount,
                                address,
                                couponInfo,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
    
                            resolve(orderDetails); // ✅ Resolve the promise after successful payment
                        } catch (err) {
                            reject(err); // ❌ Reject in case of payment failure
                        }
                    },
                    "notes": {
                        "address": "Razorpay Corporate Office"
                    },
                    "theme": {
                        "color": "#F43F5E"
                    },
                    "modal": {
                        "confirm_close": true
                    }
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
    
                rzp1.on("payment.failed", function (response) {
                    reject(new Error(response.error)); // ❌ Reject the promise if payment fails
                });
            });
    
        } catch (error) {
            ErrorHandler(error);
            throw error;  // Rethrow error to be caught in handleSubmit
        }
    }
    

    async cancelOrder(orderId) {
        try {
            if(!orderId) throw new Error("Product Id is required !!")
    
            const cancelOrderResponse = await httpClient.post(`${API_ENDPOINTS.ORDERS}/cancel-order-by-id`, {
                orderItemId: orderId
            })
    
            return cancelOrderResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
    
    async getOrderItems({page, limit, filter}) {
        try {
            const orderItemResponse = await httpClient.get(`${API_ENDPOINTS.ORDERS}/get-orders`, {
                params: {
                    page,
                    limit,
                    filter
                }
            })
            console.log(orderItemResponse)
            
            return orderItemResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    // async updateCartProductQuantity({productId, quantity}) {
    //     try {
    //         if(!productId || quantity === 0         ) throw new Error("Product Id is required !!")
    
    //         const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/change-product-quantity`, {
    //             productId, quantity
    //         })
    
    //         return cartResponse
    //     } catch (error) {
    //         ErrorHandler(error)
    //     }
    // }
};

export default new OrderService();