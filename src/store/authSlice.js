import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    status: false,
    userData: null,
    userType: null // default value
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state,action) =>{
            state.status = true,
            state.userData = action.payload.at(0) // data of the current logged in user
            state.userType = action.payload.at(1) || "guest" // type of the current logged in user (CUstomer/Seller) default is guest
            console.log(action.payload.at(0),action.payload.at(1))
        },
        logout: (state,action) => {
            state.status = false,
            state.userData = null
            state.userType = "guest"
            // state.cartSlice.cartItems = []
        }
    }
})

// to import in componenets
export const {login,logout} = authSlice.actions

// to import in store
export default authSlice.reducer