import Config from '../conf/conf'
import {Client,Teams, Users} from 'node-appwrite'


// create a client for the team creator(team owner)
const client = new Client()
    .setEndpoint(Config.appwriteUrl)
    .setProject(Config.appwriteProjectId)
    .setKey(Config.appwritesellerTeamManagerApiKey)


// create a teams object
const teams = new Teams(client)
const users = new Users(client);

// create a function which takes useid, name of the user and email of the new seller to be added tp the seller team
const addMemberToTeam = async ({userId,userName,userEmail}) => {
    try{
        // verify the user (email verification)
        // await users.updateEmailVerification(userId,true)

        const response = await teams.createMembership(
            Config.appwritesellerTeamId,
            ["Seller"],
            userEmail,
            userId,
            undefined,
            undefined,
            userName
        )
        return response
    } catch(error){
        // console.log("Error addMemberToTeam: ",error)
        throw new Error(error.message);
        
    }
}


export default addMemberToTeam




