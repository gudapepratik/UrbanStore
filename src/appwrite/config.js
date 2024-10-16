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
    async getProducts() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID, // param1 - database id
                conf.appwriteproductsId, // param2 - collection id - products
                )
        } catch (error) {
            console.log(`Apprite service :: getProducts ${error}`)
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
            console.log("Error : getSingleProduct ",error)
        }
    }

    // method to add and item to cart when user clicks 'ADD TO CART'
    // we will require the authenticated userid, productid, quantity
    async addItemToCart({userid, productid, qty}) {
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
                        quantity: qty,
                        added_at: new Date().toISOString(),
                    }   
                )
            }

        } catch(error) {
            console.log(`Apprite service :: addItemToCart ${error}`)
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

            // just return true indicating that the post is deleted
            return true;
        } catch(error) {
            console.log(`Apprite service :: deleteCartItem ${error}`)
            return false;
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
            console.log(`Apprite service :: getCartItems ${error}`)
            return false;
        }
    }

    // userid - id of the user placing the order
    // cartItems - array of objects containing items in cart as objects 
    async placeOrder(userid, cartItems){
        try {
        const productids = cartItems.map(item => item.product_id) // array containing all the product id of the products in cart
        const totalAmount = cartItems.reduce((total,item) => total + item.price*item.quantity,0)

        await this.databases.createDocument(
            conf.appwriteDatabaseID, // param1 -- database id
            conf.appwriteordersId, // param2 -- collection id -- orders
            ID.unique(),
            {
                user_id: userid,
                product_ids: productids,
                total_amount: totalAmount,
                status: "pending",
                created_at: new Date().toISOString(),
            }

        )
        console.log("Order placed Successfully")
        return true 
        } catch(error){
            console.log(`Error: placeOrder ${error}`)
            return false
        }

    } 

    async getImageUrl(fileid){
        try {
            return await this.bucket.getFilePreview(
                conf.appwriteproductimageBucketId,
                fileid
            )

        } catch(error){
            console.log(`Error : getImageUrl ${error}`)
        }
    }
}


// Service ka object banado and use export karo so that hame ek object milega and usepe ham . method se 
// konse bhi functions access kar sakte hai
const service = new Service();
export default service

