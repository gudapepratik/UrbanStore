// har bar import karne ke liye itne bade naam na likhne pade isliye aisa karna  hai 
const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APP_PROJECT_ID),
    appwriteDatabaseID: String(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID),
    appwritecartsId: String(import.meta.env.VITE_APP_CARTS_COLLECTION_ID),
    appwriteordersId: String(import.meta.env.VITE_APP_ORDERS_COLLECTION_ID),
    appwriteproductsId: String(import.meta.env.VITE_APP_PRODUCTS_COLLECTION_ID),
    appwriteproductimageBucketId: String(import.meta.env.VITE_APP_PRODUCT_IMAGE_BUCKET_ID),
}

export default conf