import Config from '../conf/conf'
import {Client,Teams} from 'node-appwrite'


// create a client for the team creator(team owner)
const client = new Client()
    .setEndpoint(Config.appwriteUrl)
    .setProject(Config.appwriteProjectId)
    .setKey(Config.appwritesellerTeamManagerApiKey)


// create a teams object
const teams = new Teams(client)


// create a function which takes useid, name of the user and email of the new seller to be added tp the seller team
const addMemberToTeam = async ({userId,userName,userEmail}) => {
    try{
        const response = await teams.createMembership(
            Config.appwritesellerTeamId,
            ['seller'],
            userEmail,
            userId,
            undefined,
            'http://localhost:5173/sellerdashboard/',
            userName
        )
    
        console.log(response)
        return response
    } catch(error){
        console.log("Error addMemberToTeam: ",error)
    }
}


export default addMemberToTeam




