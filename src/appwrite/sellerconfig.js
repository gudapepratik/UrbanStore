import conf from "../conf/conf";
// import { useState } from "react";
import {Account,ID,Client,Databases,Storage,Query} from 'appwrite'

// read this documnentation --> https://appwrite.io/docs/references/cloud/client-web/databases
export class sellerService{
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

    // method to get all the products in database collection(products) that are added by the current seller
    // also can filter if category is specified
    async getProducts({sellerid,category}) {
        try {
            if(category === 'All Products') {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwriteproductsId, // param2 - collection id - products
                    // Query to get all documents having sellerid equals to current sellerid (i.e. all products added by the seller)
                    // get in order - most recent to old 
                    [
                        Query.equal('sellerid',sellerid),
                        Query.orderDesc('')
                    ]
                )
            }
            return await this.databases.listDocuments(
                conf.appwriteDatabaseID, // param1 - database id
                conf.appwriteproductsId, // param2 - collection id - products
                // Query to get all documents having sellerid equals to current sellerid (i.e. all products added by the seller)
                [
                    Query.equal('sellerid',sellerid),
                    Query.equal('category',category),
                    Query.orderDesc('')
                ]
            )
        } catch (error) {
            throw new Error(error);
        }
    }

    // method to upload images to appwrite storage (to be done before adding the new product to database cause we need to have unique file id's
    // of all 4 images)
    // parameter - we need to give file as a parameter which we get from input:file html tag
    // return - is successfull - file (with file id) else - throws error
    // reference - https://appwrite.io/docs/references/cloud/client-web/storage
    async addNewImage(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteproductimageBucketId,
                ID.unique(),
                file,
            )
        } catch(error){
            throw new Error(error);
        }
    }

    // method to add new product in collection (products)
    // we will require all the product details in an object
    async addNewProduct({name, price, description, stock, category, image, sellerid, seller}) {
        try{
                //create new document in products collection using createDocument() method
                return await this.databases.createDocument(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwriteproductsId, // param2 - collection id (products)
                    ID.unique(), // unique id for every document
                    { // json data 
                        name: name, // name of the product (string)
                        price: Number(price), // price of the product (string)
                        description: description, // description of the product (string)
                        stock: Number(stock), // product stock (integer)
                        category: category, // product category (string)
                        image: image, // file id's of all 4 images in an array (string array/list)
                        sellerid: sellerid, // id of seller who's adding the product (string)
                        seller: seller, // name of the seller who's adding the product (string)
                        created_at: new Date().toISOString(), // time at which the product is being added (DateTime)
                    }   
                )

        } catch(error) {
            throw new Error(error);
            
        }
    }

    // method to update the product details
    async updateProduct({productId,updateData}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseID,
                conf.appwriteproductsId,
                productId,
                {   // data to be updated
                    name: updateData.name,
                    price: updateData.price,
                    description: updateData.description,
                    stock: updateData.stock,
                }
            )
        } catch(error){ 
            throw new Error(error.message);
        }
    }

    // method to remove a product from "products" collection
    // for this we require the unique id of the product document (product.$id)
    async deleteProduct({documentid, imageIds}) {
        try {
            // delete all the images from bucket
            const response = await Promise.all(
                imageIds.map(async (fileId) => (
                    await this.deleteFile(fileId)
                ))
            )

            if(response) {
                // no need to return the response
                return await this.databases.deleteDocument(
                    conf.appwriteDatabaseID, // param1 - database id
                    conf.appwriteproductsId, // param2 - collection id (products)
                    documentid, // param3 - id of document to be deleted
                )
            } else{
                throw new Error(response)
            }
        } catch(error) {
            throw new Error(error);
        }
    }

    // method to delete an image file from appwrite bucket(storage)
    async deleteFile(fileId) {
        try{
            await this.bucket.deleteFile(
                conf.appwriteproductimageBucketId,
                fileId
            )
        } catch(error){
            throw new Error(error.message);
            
        }
    }

    // method to get the preview of any image using the fileid
    async getImageUrl(fileid){
        try {
            return this.bucket.getFilePreview(
                conf.appwriteproductimageBucketId,
                fileid
            )
        } catch(error){
            throw new Error(error);
        }
    }

    // method to get all the orders that the seller got using the seller id
    async getOrders({sellerId, filterCategory}) {
        try{
            if(filterCategory === 'allorders') {
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    [
                        Query.equal('seller_id',sellerId),
                        Query.orderDesc('') // get most recent order first
                    ]
                )
            } else{
                return await this.databases.listDocuments(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    [
                        Query.equal('seller_id',sellerId),
                        Query.equal('State',filterCategory),
                        Query.orderDesc('') // get most recent order first
                    ]
                )
            }
        } catch(error) {
            throw new Error(error);
        }
    }

    // get details of single product using the product id
    async getSingleProduct(productId) {
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseID,
                conf.appwriteproductsId,
                productId
            )
        } catch(error) {
            throw new Error(error);
        }
    }

    // method to update the order State
    async updateOrderStatus({orderId,productId,currentStock,quantityOrdered,updateStatus}){
        try{
            // ship order
            if(updateStatus === 'ship'){
                // decrease the order stock
                const res = await this.databases.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteproductsId,
                    productId,
                    {
                        'stock': currentStock-quantityOrdered
                    }
                )
                
                if(!res) throw new Error(res)

                // update the order status in orders collection
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    orderId,
                    {
                        'State': 'shipped'
                    }
                )
            }

            // deliver order
            if(updateStatus === 'deliver'){
                // update the order status in orders collection
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    orderId,
                    {
                        'State': 'delivered'
                    }
                )
            }

            // cancel order
            if(updateStatus === 'cancel'){
                // update the order status in orders collection
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseID,
                    conf.appwriteordersId,
                    orderId,
                    {
                        'is-cancelled': true,
                        'State': 'cancelled',
                    }
                )
            }

        } catch(error){
            throw new Error(error.message);
        }
    }
}


// Service ka object banado and use export karo so that hame ek object milega and usepe ham . method se 
// konse bhi functions access kar sakte hai
const sellerservice = new sellerService();
export default sellerservice

