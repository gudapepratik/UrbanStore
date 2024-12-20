import conf from "../conf/conf";
// import { useState } from "react";
import {Account,ID,Client,Databases,Storage,Query} from 'appwrite'

// read this documnentation --> https://appwrite.io/docs/references/cloud/client-web/databases
export class Service{
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    // method to get all the products in database collection - products to show them on screen
    async getProducts({limit,onpage,categories}) {
        // console.log(limit,onpage)
        // const categoryArray = [category]
        // console.log(categories)
        try {
            if(categories && categories.at(0) !== 'All Products'){
                // console.log(categories)
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwriteproductsId, // param2 - collection id - products
                    // following queries are for pagination
                    [
                        Query.equal('category',categories),
                        Query.limit(limit),
                        Query.offset(limit*(onpage-1)),
                    ]
                    )
            } else{
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwriteproductsId, // param2 - collection id - products
                    // following queries are for pagination
                    [
                        Query.limit(limit),
                        Query.offset(limit*(onpage-1))
                    ]
                    )
            }
        } catch (error) {
            // console.log(`Apprite service :: getProducts ${error}`)
            return [] // return an empty array 
        }
    }

    async getSingleProduct(productid) {
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteproductsId,        
                productid
            )
        } catch(error){
            throw new Error(error)
        }
    }

    // method to add and item to cart when user clicks 'ADD TO CART'
    // we will require the authenticated userid, productid, quantity
    async addItemToCart({userid, productid, quantity,previewImgUrl}) {
        try{
            // check if the document already exists // match using userid and productid
            const document = await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwritecartsId,
                [Query.equal("user_id",userid), Query.equal("productid",productid)]
            )
            // if the document already exists , then just update that document using updatedocument method
            if(document.total !== 0){
                // get the previous quantity in that document
                const qty = document.documents[0].quantity
                // update document with quantity++
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwritecartsId,
                    document.documents[0].$id,
                    {
                        quantity: qty+1
                    },
                )
                // Note: if the document is updated we will get the updated document as response from addItemToCart function
            } else{
                // else create new document
                return await this.databases.createDocument(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwritecartsId, // param2 - collection id - carts
                    ID.unique(), // unique id for every document
                    { // json data 
                        user_id: userid,
                        productid: productid,
                        quantity: quantity,
                        previewImgUrl: previewImgUrl,
                        added_at: new Date().toISOString(),
                    }   
                )
            }

        } catch(error) {
            // console.log(`Apprite service :: addItemToCart ${error}`)
            throw new Error(error.message);
            
        }
    }

    // method to delete a post (databases,deleteDocument)
    async deleteCartItem(documentid) {
        try {
            // no need to return the response
        await this.databases.deleteDocument(
                conf.appwriteDatabaseID, // param1 - database id
                conf.appwritecartsId, // param2 - collection id
                documentid, // param3 - id of document to be deleted
            )
        } catch(error) {
            throw new Error(error.message)
        }
    }

    // method to get a post (databases.getDocument())
    // we are not using getDocument because for that we will require the documnet id 
    // of the item to get , but when the user clicks the Cart button , we only have it's unique 
    // userid from which we can get all the items in cart for that user. therefore to get all the documents/items
    // from the collection carts, we will use listDocuments() where we can add a query, that only give the item whose
    // userid matched with the id of the current user.
    async getCartItems(userid) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID, // param1 - database id
                conf.appwritecartsId, // param2 - collection id
                [Query.equal("user_id",userid)], // param3 - queries array --> userid match with current user's id
            )
        } catch(error) {
            // console.log(`Apprite service :: getCartItems ${error}`)
            return false;
        }
    }

    // userid - id of the user placing the order 
    async placeOrder({customer_id,seller_id,price,product_id,paymentMethod,quantity,address,expected_delivery_date}){
        try {
        await this.databases.createDocument(
            conf.appwriteDatabaseID, // param1 -- database id
            conf.appwriteordersId, // param2 -- collection id -- orders
            ID.unique(),
            {
                customer_id: customer_id,
                product_id: product_id,
                seller_id: seller_id,
                quantity: quantity,
                price: price,
                paymentMethod: paymentMethod,
                State: "placed",
                address: address,
                'is-cancelled': false,
                expected_delivery_date: expected_delivery_date.toISOString()
            }

        )
        } catch(error){
            throw new Error(error.message);
        }
    }
    
    
    async updateProductQuantity({productId,quantityToReduce}) {
        try {
            // get the current product to get the current product stock
            const product = await this.getSingleProduct(productId)
            const currentStock = product.stock

            await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteproductsId,
                productId,
                {
                    stock: currentStock-quantityToReduce,
                }
            )
        } catch(error) {
            throw new Error(error.message);
        }
    }


    // method to get all the items in orders collection
    // each call will retrive the 'limit' no. of documents for page no. 'onpage' in most recent to most lastly added order
    async getAllOrders({limit,onpage,customer_id,filterCategory}) {
        try{
            if(filterCategory === 'allOrders') {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    [
                        Query.equal("customer_id",customer_id),
                        Query.orderDesc(''),
                        Query.limit(limit),
                        Query.offset(limit*(onpage-1)),
                    ]
                )
            } else{
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    [
                        Query.equal("customer_id",customer_id),
                        Query.equal('State',filterCategory.toLowerCase()),
                        Query.orderDesc(''),
                        Query.limit(limit),
                        Query.offset(limit*(onpage-1)),
                    ]
                )
            }
        } catch(error) {
            throw new Error(error.message);
            
        }
    }

    // method to cancel order
    async cancelOrder(orderId) {
        try{
            await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteordersId,
                orderId,
                {
                    'State': "cancelled",
                    'is-cancelled': true
                }
            )
        } catch(error){
            throw new Error(error.message);
            
        }
    }

    async getImageUrl(fileid){
        try {
            return await this.bucket.getFilePreview(
                conf.appwriteproductimageBucketId,
                fileid
            )

        } catch(error){
            // console.log(`Error : getImageUrl ${error}`)
            throw new Error(error.message);
            
        }
    }

    // search products
    async searchProductsbyname(key) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID,
                conf.appwriteproductsId,
                [Query.contains('description',key), Query.contains('name',key),Query.contains('category',key)]
            )
        } catch(error){
            // console.log(error)
        }
    }
}


// Create an object of the Service class and export it.
// This way, we get a single object that we can use to access any function by calling it with a dot, like objectName.methodName().
const service = new Service();
export default service

