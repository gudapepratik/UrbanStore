import config from "../conf/conf";
import {Account,ID,Client} from 'appwrite'

// read --> https://appwrite.io/docs/references/cloud/client-web/account
// this is a different approach
// yaha AuthService ek class hai , so isme we have all the functions yahi ek new client ban raha hai , nahito woh login kar rha hai
// , etc . then we have authservice ek object hai, jisko ham kahibhi import karke authservice.fun_name aise easily use kar sakte hai
// so we are exporting authservice only not AuthService class; read docs for services functions from appwrite
export class AuthService {
    client = new Client();
    account ;


    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name}) {
        try {
           const userAccount =  await this.account.create(ID.unique(), email,password,name);
           if (userAccount) {

            // call another method // agar user account successfully bana toh use direct login karwa sakta hai
            return this.login({email,password});
            // return userAccount;
           } else {
            // agar account create nahi hua to woh error return karo , baki appwrite handle kar lega
                return userAccount;
           }
        } catch(error) {
            // throw error;
            console.log("Error :: CreateAccount")
        }
    }
    
    async login({email ,password}) {
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch(error) {
            // throw error;
            console.log("Error :: login",error)
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch(error) {
            console.log("appwrite service :: getCurrentUser")
        }
        
        return null;
    }
    
    async logOut() {
        
        try {
            // we are using deleteSessions() because user agar logout kar rha hai toh
            // usne jha jha bhi login kara tha , laptop , mobile, etc, (ise session kehte hai) un sabse woh logout ho
            // jaye
            await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite service :: logout",error)
            
        }
    }
}

const authService = new AuthService();

export default authService;