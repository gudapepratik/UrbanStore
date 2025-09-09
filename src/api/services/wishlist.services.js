import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js"
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

class WishlistService{

    async addProductToCart(productId) {
        try {
            if(!productId) throw new Error("Product Id is required !!")
    
            const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/add-to-cart`, {
                productId
            })
    
            return cartResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async removeProductFromCart(productId) {
        try {
            if(!productId) throw new Error("Product Id is required !!")
    
            const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/remove-from-cart`, {
                productId
            })
    
            return cartResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
    
    async getCartData() {
        try {
            const cartResponse = await httpClient.get(`${API_ENDPOINTS.CART}/get-cart-products`)
            
            return cartResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async updateCartProductQuantity({productId, quantity}) {
        try {
            if(!productId || quantity === 0         ) throw new Error("Product Id is required !!")
    
            const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/change-product-quantity`, {
                productId, quantity
            })
    
            return cartResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
};

export default new WishlistService();