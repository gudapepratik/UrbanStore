import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js";
import {triggerNotification} from '../../utils/triggerNotification.utils.js'
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class AuthService {
    // all the service functions here
    // method to handle login
    // data required - name(string), email(string), password(string), contactNumber(string), role(string)
    async registerUser({name, email, password, contactNumber, role}) {
        try {

            if(
                [name, email, password, contactNumber, role].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }
            // call the api
            const registerResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/register`, {
                name,
                email,
                contactNumber,
                password,
                role
            })
            console.log(registerResponse)
    
            if(!registerResponse) throw new Error("Error while creating new user account !!?")
    
            return registerResponse;
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async loginUser({email,password, role}) {
        try{
            // login the current user
            const reponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/login`, {email,password,role})
            console.log(reponse)
            // return the response // the tokens will be stored in cookies
            return reponse

        } catch(error) {
            ErrorHandler(error)
            // return error
        }
    }

    async logoutUser() {
        try{
            console.log("asf")
            const logoutResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/logout`)
            // const device = localStorage.getItem('deviceId')
            return logoutResponse
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async getCurrentUser() {
        try{
            const userResponse = await httpClient.get(`${API_ENDPOINTS.AUTH}/get-current-user`)
            // console.log(products)
            // const device = localStorage.getItem('deviceId')
            return userResponse.data.data
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async updateUserDetails({name, email, password}) {
        try{
            if(
                [name, email, password].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }

            const updatedDetailsResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/update-user-details`, {
                name,
                email,
                password
            })
            
            return updatedDetailsResponse;
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async updateUserPassword({oldPassword, newPassword}) {
        try{
            if(
                [oldPassword, newPassword].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }

            const updatedDetailsResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/update-user-password`, {
                oldPassword,
                newPassword
            })
            
            return updatedDetailsResponse;
        }catch(error) {
            ErrorHandler(error)
        }
    }



};

export default new AuthService();