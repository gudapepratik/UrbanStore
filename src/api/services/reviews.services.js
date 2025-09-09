import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js"
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

class ReviewService{
    async addProductReview({productId, review, rating, images}) {
        try {
            if(!productId || !review || !rating) throw new Error("Insufficient Data !!")
            // Create a new FormData instance
            const formData = new FormData();
    
            // Append fields to FormData
            formData.append('productId', productId);
            formData.append('review', review);
            formData.append('rating', rating);
    
            // Append files (images) to FormData
            if(images) {
                Array.from(images).forEach((image, index) => {
                    formData.append('images', image); // Field name matches your multer configuration
                });
            } else{
                formData.append('images', {})
            }

            const reviewReponse = await httpClient.post(`${API_ENDPOINTS.REVIEW}/add-review`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Explicitly set content type
                    },
                }
            )
    
            return reviewReponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async getProductReviews({productId}) {
        try {
            if(productId === "") throw new Error("Product Id is required !!")
                
            const reviewReponse = await httpClient.get(`${API_ENDPOINTS.REVIEW}/get-product-reviews`, {
                params: {
                    productId
                }
            })
            
            return reviewReponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async getProductReviewMetrics({productId}) {
        try {
            if(productId === "") throw new Error("Product Id is required !!")
                
            const reviewReponse = await httpClient.get(`${API_ENDPOINTS.REVIEW}/get-product-review-metrics`, {
                params: {
                    productId
                }
            })
            
            return reviewReponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    

    async getCustomerReviews() {
        try {
            
            const reviewReponse = await httpClient.get(`${API_ENDPOINTS.REVIEW}/get-reviews-by-customer`)
            
            return reviewReponse
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async removeProductReview(reviewId) {
        try {
            if(!reviewId) throw new Error("review Id is required !!")
    
            const deleteReviewReponse = await httpClient.delete(`${API_ENDPOINTS.REVIEW}/remove-product-review`, {
                params: {
                    reviewId
                }
            })
    
            return deleteReviewReponse
        } catch (error) {
            ErrorHandler(error)
        }
    }
};

export default new ReviewService();