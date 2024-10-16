import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartitems: [],
    // cartitems is an array which will contain objects having product info
    // object --> {
            // productid: ""
            // productname: ""
            // price: ""
            // quantity: 0,1,2,...
    //}
    totalAmount: 0,
    // this is to be used when a new item is added
    isnewitemadded: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state,action) =>{
            // check if the item to be added is already in the list
            const itemtoadd = action.payload
            // console.log("item to add",itemtoadd,state.cartitems)
            // const alreadyexists = state.cartitems.find(item => item.productid === itemtoadd.productid)
            // console.log(alreadyexists)
            // if not exists
            // if(!alreadyexists){
                state.cartitems.push({
                    documentid: itemtoadd.documentid,
                    productid: itemtoadd.productid,
                    name: itemtoadd.name,
                    price: itemtoadd.price,
                    quantity: itemtoadd.quantity,
                    imgurl: itemtoadd.imgurl
                })
            // } else{
                // alreadyexists.quantity += 1
            // }

            state.totalAmount += itemtoadd.price*itemtoadd.quantity
        },

        removeFromCart: (state,action) => {
            const documentid = action.payload
            const existingitem = state.cartitems.find(item => item.documentid === documentid)

            if(existingitem){
                state.totalAmount -= existingitem.price*existingitem.quantity
                state.cartitems = state.cartitems.filter(item => item.documentid !== documentid)
            } 
        },

        clearCart: (state,action) => {
            state.cartitems = []
            state.totalAmount = 0
        },

        setIsNewItemAdded: (state,action) => {
            state.isnewitemadded = !state.isnewitemadded
        }
    },
})

export const {addToCart,removeFromCart,clearCart,setIsNewItemAdded} = cartSlice.actions

export default cartSlice.reducer