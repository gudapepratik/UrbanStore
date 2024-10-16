import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    products: [] ,// array of objects
    isloading: false,
    error: null,
}

const productSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        setProducts: (state,action) => {
            state.products = action.payload
            state.isloading = false
        },

        setLoading: (state,action) => {
            state.isloading = action.payload
        },

        setError: (state,action) => {
            state.error = action.payload
            state.isloading = false
        },
    }
})

export const {setProducts,setLoading,setError} = productSlice.actions 

export default productSlice.reducer