import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js";
import {triggerNotification} from '../../utils/triggerNotification.utils.js'
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

class ProductService{

    async addProduct({name, brand, price, stockInfo, category, description, images}) {
        try {
            // Create a new FormData instance
            const formData = new FormData();

            const stockInfoSerialized = JSON.stringify(stockInfo);
    
            // Append fields to FormData
            formData.append('brand', brand);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('stockInfo', stockInfoSerialized);
            formData.append('category', category);
            formData.append('description', description);
    
            // Append files (images) to FormData
            images.forEach((image, index) => {
                formData.append('images', image); // Field name matches your multer configuration
            });
    
            // Send the multipart/form-data request
            const productResponse = await httpClient.post(
                `${API_ENDPOINTS.PRODUCTS}/add-new-product`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Explicitly set content type
                    },
                }
            )

        } catch (error) {
            ErrorHandler(error)
        }
    };

    async getProducts({page, limit, categories}) {
        try {
            if(page === 0 || limit <= 0) throw new Error('All fields are required !!')
            let productResponse;
            if(categories.length > 0) {
                productResponse = await this.getProductsByCategories({page,limit,categories})
            } else{
                productResponse = await httpClient.get(`${API_ENDPOINTS.PRODUCTS}/get-products`,{
                    params: {
                        page: page,
                        limit: limit,
                    }
                })
            }
    
            return productResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async getProductsBySeller({page, limit, categories}) {
        try {
            if(page === 0 || limit <= 0) throw new Error('All fields are required !!')
            
            const productResponse = await httpClient.get(`${API_ENDPOINTS.PRODUCTS}/get-products-by-seller`,{
                    params: {
                        page: page,
                        limit: limit,
                        categories: categories === 'All Products'? '': categories
                    }
            })

            return productResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async getProductById(productId) {
        try {
            if(!productId) throw new Error('product ID is required !!')
    
            const productResponse = await httpClient.get(`${API_ENDPOINTS.PRODUCTS}/get-product-by-id/${productId}`)
    
            return productResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async getProductsByCategories({page, limit, categories}) {
        try {
            console.log(categories)
            if(page === 0 || limit <= 0 || categories.length === 0) throw new Error('All fields are required !!')
    
            const productsResponse = await httpClient.get(`${API_ENDPOINTS.PRODUCTS}/get-products-by-categories`, {
                params: {
                    categories: categories,
                    page: page,
                    limit: limit
                }
            })
    
            return productsResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async updateProductDetails({productId, name, brand, description, price, stock}) {
        try {
            console.log(productId)
            const updateResponse = await httpClient.post(`${API_ENDPOINTS.PRODUCTS}/update-product-details`, {
                    productId,
                    name,
                    brand,
                    description,
                    price,
                    stock
            })
    
            return updateResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async deleteProductById(productId) {
        try {
            if(!productId) throw new Error('product ID is required !!')
            console.log(productId)
    
            const productDeleteResponse = await httpClient.post(`${API_ENDPOINTS.PRODUCTS}/delete-product-by-id/${productId}`)
    
            return productDeleteResponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
};

export default new ProductService();