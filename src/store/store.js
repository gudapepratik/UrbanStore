import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice.js';
import productSlice from './productSlice.js';
import cartSlice from './cartSlice.js';

const store = configureStore({
    reducer: {
        authSlice,
        productSlice,
        cartSlice,
    },
});


export default store;