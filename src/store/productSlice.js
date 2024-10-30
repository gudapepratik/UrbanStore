import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    products: [] ,// array of objects
    isloading: false,
    key: "",
    error: null,
}

const productSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        setProducts: (state,action) => {
            console.log(action.payload)
            console.log(state.key)
            if(state.key && state.key.length > 0){
                const filetered_products = action.payload.map(product => (
                    product.name.toLowerCase().includes(action.key)
                ))
                console.log(filetered_products)
                state.products = filetered_products
                state.isloading = false
            } else{
                state.products = action.payload
                state.isloading = false
            }
        },

        setLoading: (state,action) => {
            state.isloading = action.payload
        },

        setKey: (state,action) => {
            state.key = action.payload
        },

        setError: (state,action) => {
            state.error = action.payload
            state.isloading = false
        },
    }
})

export const {setProducts,setLoading,setError,setKey} = productSlice.actions 

export default productSlice.reducer