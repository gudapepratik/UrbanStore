import config from "../conf/conf";
import {Account,ID,Client, Teams, Query} from 'appwrite'
import addMemberToTeam from "./serviceacc";

// read --> https://appwrite.io/docs/references/cloud/client-web/account
// this is a different approach
// AuthService is a class that contains all the functions for authentication (like creating a new client, logging in, etc.).
// We are not directly using the AuthService class; instead, we create an object from it called authService.
// By exporting only the authService object, we can easily use it anywhere in the project by importing it and calling its functions like authService.functionName().
// If you need to know more about the functions this service provides, refer to the Appwrite documentation.
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

    // method to create a new customer account
    async createAccount({email, password, name}) {
        try {
            // create new user account
            await this.account.create(ID.unique(), email,password,name)

            // call another method to login the user directly if the account is successfully registered
            return this.login({email,password});
        } catch(error) {
            // throw error otherwise
            throw new Error(error.message)
        }
    }

    // method to create a new seller account
    async RegisterSeller({email,password,name}) {
        // create a new user and then give them the membership of the team "seller"
        try{
            // 1. create a new user
            const user = await this.account.create(ID.unique(), email, password,name)

            // 2. login user
            const loginResponse = await this.account.createEmailPasswordSession(email,password)

            // 3. add the logged in user to seller team (using appwrite server SDK to directly add to team without email verification required)
            const teamData = await this.AddToTeam({
                userId: loginResponse.userId,
                userEmail: email,
                userName: name
            })
            
            // get the data of currently logged in user (seller)
            const userData = await this.getCurrentUser()

            // combine the userData and team data and return it
            const data = {
                ...userData,
                'teamId': teamData?.teamId,
                'teamName': teamData?.teamName,
                'roles': teamData?.roles
            }

            return data
        } catch(error){
            throw new Error(error)
        }
    }

    // method to call the addMemberToTeam() function in server sdk
    async AddToTeam({userId,userName,userEmail}) {
        try {
            const response = await addMemberToTeam({userId,userName,userEmail})
            return response
        } catch(error){
            // console.log("Error AddToTeam: ",error)
            throw new Error(error)
            
        }
    }
    
    // method to create a emailPassword session for user i.e. login session
    async login({email ,password}, type) {
        try {
            const response =  await this.account.createEmailPasswordSession(email,password)

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
            // throw error
            throw new Error(error);
            
        }
    }

    // method to get the details of currently logged in user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch(error) {
            throw new Error(error.message);
            
        }
        
        return null;
    }
    
    // method to logout current user across all devices
    async logOut() {
        try {
            // deleteSessions() will kill all the active session of currently logged in user across all devices
            await this.account.deleteSessions();
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

const authService = new AuthService();

export default authService;