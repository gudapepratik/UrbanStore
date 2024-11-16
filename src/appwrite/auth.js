import config from "../conf/conf";
import {Account,ID,Client, Teams, Query} from 'appwrite'
import addMemberToTeam from "./serviceacc";

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
        this.teams = new Teams(this.client);
    }

    // create a new customer account
    async createAccount({email, password, name}) {
        try {
           const userAccount =  await this.account.create(ID.unique(), email,password,name);
           console.log(userAccount)

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

    // create a new seller account (changes can be done / not finalized)
    async RegisterSeller({email,password,name}) {
        // first create a new user and then give them the membership of the team "seller"
        try{
            // 1. create a new user
            const user = await this.account.create(ID.unique(), email, password,name)
            console.log(user)

            const res = await this.account.createEmailPasswordSession(email,password)
            console.log(res)

            const response = await this.account.createVerification('http://localhost:5173/sellerdashboard/login')
            // after this it will be redirected to login page. implementation after this is in sellerlogin.jsx component
            // if(response) {
            //     alert("Check Your email for verification")
            // }
            return response
        } catch(error){
            console.log("Error :: Registerseller",error)
            throw new Error(error);
        }
    }

    // function to call the addMemberToTeam() function in server sdk
    async AddToTeam({userId,userName,userEmail}) {
        try {
            const response = await addMemberToTeam({userId,userName,userEmail})
        } catch(error){
            // console.log("Error AddToTeam: ",error)
            throw new Error(error)
            
        }
    }
    
    async login({email ,password}, type) {
        try {
            const response =  await this.account.createEmailPasswordSession(email,password)
            console.log(response)

            // check if the current logged in user is a Seller account
            const inTeam = await this.teams.list([Query.equal('name','Seller')])
            if(inTeam.total) { // we are able to do this because we only have one team
                // seller account
                if(type === 'Customer'){
                    alert("Error: You need to have registered Customer account")
                    return await this.logOut()
                } else{
                    // correct account login
                    return response;
                }
            } else{
                // if the current logged in user is a customer but type is Seller then logout that account
                if(type === 'Seller'){
                    alert("Error: You need to have registered Seller account")
                    return await this.logOut()
                } else{
                    // correct account login
                    return response;
                }
            }

        } catch(error) {
            // throw error;
            console.log("Error :: login",error.message)
            throw new Error(error);
            
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