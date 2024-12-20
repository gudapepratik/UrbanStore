import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    products: [] ,// array of objects
    isloading: false,
    key: "",
    error: null,
    filter: ['All Products'],
    onPage: 1,
    filterCategories: {
        "men": {
            "clothing": [
                "Men's Shirts",
                "Men's T-Shirts",
                "Men's Hoodies & Sweatshirts",
                "Men's Jackets",
                "Men's Coats",
                "Men's Jeans",
                "Men's Trousers",
                "Men's Shorts",
                "Men's Activewear",
                "Men's Innerwear"
            ],
            "footwear": [
                "Men's Sneakers",
                "Men's Loafers",
                "Men's Formal Shoes",
                "Men's Sandals",
                "Men's Slippers"
            ],
            "accessories": [
                "Men's Watches",
                "Men's Belts",
                "Men's Sunglasses",
                "Men's Caps & Hats",
                "Men's Bags & Backpacks"
            ],
            "ethnicWear": [
                "Men's Kurtas",
                "Men's Sherwanis",
                "Men's Ethnic Sets"
            ],
            "winterWear": [
                "Men's Sweaters",
                "Men's Thermals"
            ]
        },
        "women": {
            "clothing": [
                "Women's Tops & T-Shirts",
                "Women's Dresses",
                "Women's Hoodies & Sweatshirts",
                "Women's Jeans",
                "Women's Trousers",
                "Women's Skirts",
                "Women's Shorts",
                "Women's Ethnic Wear",
                "Women's Activewear",
                "Women's Innerwear"
            ],
            "footwear": [
                "Women's Sneakers",
                "Women's Flats",
                "Women's Heels",
                "Women's Sandals",
                "Women's Boots"
            ],
            "accessories": [
                "Women's Watches",
                "Women's Jewelry",
                "Women's Bags & Clutches",
                "Women's Belts",
                "Women's Scarves & Stoles"
            ],
            "ethnicWear": [
                "Women's Kurtas & Kurtis",
                "Women's Sarees",
                "Women's Lehenga Cholis"
            ],
            "winterWear": [
                "Women's Sweaters",
                "Women's Jackets & Coats"
            ]
        },
        "unisex": {
            "general": [
                "Hoodies & Sweatshirts",
                "Activewear",
                "Sneakers",
                "Caps & Hats",
                "Backpacks"
            ]
        }
    }
}

const productSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        setProducts: (state,action) => {
            // console.log(action.payload)
            // console.log(state.key)
            if(state.key && state.key.length > 0){
                const filetered_products = action.payload.map(product => (
                    product.name.toLowerCase().includes(action.key)
                ))
                // console.log(filetered_products)
                state.products = filetered_products
                state.isloading = false
            } else{
                state.products = action.payload
                state.isloading = false
            }
        },

        setPage: (state,action) => {
            if(action.payload === 'next'){
                state.onPage += 1
            }
            
            if(action.payload === 'prev'){
                if(state.onPage !== 1){
                    state.onPage -= 1
                }
            }
        },

        setFilter: (state,action) => {
            // console.log(action.payload)
            // reset the page
            state.onPage = 1
            // set the filter
            state.filter = action.payload
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

export const {setProducts,setLoading,setError,setKey, setPage,setFilter} = productSlice.actions 

export default productSlice.reducer