import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js"
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

class CartService{

    async addProductToCart({productId, size}) {
        try {
            if(!productId) throw new Error("Product Id is required !!")
    
            const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/add-to-cart`, {
                productId,
                size
            })
    
            return cartResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async removeProductFromCart(cartItemId) {
        try {
            if(!cartItemId) throw new Error("Product Id is required !!")
    
            const cartResponse = await httpClient.post(`${API_ENDPOINTS.CART}/remove-from-cart`, {
                cartItemId
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
            if(!productId || quantity === 0) throw new Error("Product Id is required !!")
    
            const updateResponse = await httpClient.post(`${API_ENDPOINTS.CART}/change-product-quantity`, {
                productId, quantity
            })
    
            return updateResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async updateCartProductSize({productId, size}) {
        try {
            if(!productId || size === "") throw new Error("Product Id is required !!")
    
            const updateResponse = await httpClient.post(`${API_ENDPOINTS.CART}/change-product-size`, {
                productId, size
            })
    
            return updateResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
};

export default new CartService();