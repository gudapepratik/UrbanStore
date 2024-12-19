import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cartitems: [],
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
            
            const alreadyexists = state.cartitems.find(item => item.documentid === itemtoadd.documentid)
            
            // if not exists then add it to redux state
            if(!alreadyexists){
                state.cartitems.push(itemtoadd)
            } else{
                // item already exists, hence increament the quantity
                alreadyexists.quantity += 1
            }

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
        },

        updateItemQuantity: (state,action) => {
            // find the item
            const itemToUpdate = state.cartitems.find((item) => item.documentid === action.payload.documentid)
            const qtyDifferece = itemToUpdate.quantity-action.payload.updatedQuantity
            // update the totalAmount
            state.totalAmount -= itemToUpdate.price*qtyDifferece
            // update the item quantity
            itemToUpdate.quantity = action.payload.updatedQuantity
        }
    },
})

export const {addToCart,removeFromCart,clearCart,setIsNewItemAdded,updateItemQuantity} = cartSlice.actions

export default cartSlice.reducer