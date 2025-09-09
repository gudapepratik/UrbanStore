import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartitems: [],
    totalAmount: 0,
    // this is to be used when a new item is added
    isnewitemadded: false,
    finalAmount: 0,
    couponDetails: {}
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state,action) =>{
            // check if the item to be added is already in the list
            const itemtoadd = action.payload
            
            const alreadyexists = state.cartitems.find(item => item.cartItemId === itemtoadd.cartItemId)
            
            // if not exists then add it to redux state
            if(!alreadyexists){
                state.cartitems.push(itemtoadd)
            } else{
                // item already exists, hence increament the quantity
                alreadyexists.quantity += 1
            }
            state.totalAmount += itemtoadd.productDetails.price*itemtoadd.quantity
            state.finalAmount += itemtoadd.productDetails.price*itemtoadd.quantity
        },

        removeFromCart: (state,action) => {
            const cartItemId = action.payload
            const existingitem = state.cartitems.find(item => item.cartItemId === cartItemId)

            if(existingitem){
                state.totalAmount -= existingitem.productDetails.price*existingitem.quantity
                state.finalAmount -= existingitem.productDetails.price*existingitem.quantity
                state.cartitems = state.cartitems.filter(item => item.cartItemId !== cartItemId)
            } 
        },

        clearCart: (state,action) => {
            state.cartitems = []
            state.totalAmount = 0
            state.finalAmount = 0
        },

        setIsNewItemAdded: (state,action) => {
            state.isnewitemadded = !state.isnewitemadded
        },

        updateItemQuantity: (state,action) => {
            // find the item
            const itemToUpdate = state.cartitems.find((item) => item.cartItemId === action.payload.documentId)
            const qtyDifferece = itemToUpdate.quantity-action.payload.updatedQuantity
            // update the totalAmount
            state.totalAmount -= itemToUpdate.productDetails.price*qtyDifferece
            state.finalAmount -= itemToUpdate.productDetails.price*qtyDifferece
            // update the item quantity
            itemToUpdate.quantity = action.payload.updatedQuantity
        },

        updateItemSize: (state,action) => {
            // find the item
            const itemToUpdate = state.cartitems.find((item) => item.cartItemId === action.payload.documentId)
            itemToUpdate.size = action.payload.updatedSize
        },

        setFinalAmount: (state, action) => {
            state.finalAmount = action.payload
        },

        setCoupon: (state, action) => {
            state.couponDetails = action.payload
        },

        removeCoupon: (state,action) => {
            state.couponDetails = {}
        }
    },
})

export const {addToCart,removeFromCart,clearCart,setIsNewItemAdded,updateItemQuantity, setFinalAmount, setCoupon, removeCoupon,updateItemSize} = cartSlice.actions

export default cartSlice.reducer