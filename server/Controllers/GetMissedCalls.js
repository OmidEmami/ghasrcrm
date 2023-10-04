import IncomingCalls from "../Models/IncomingCalls.js"
export const getMissedCalls = async(req,res)=>{
    try{
        const response = await IncomingCalls.findAll({
            where:{
                IsResponse : 0
            }
        })
        res.json(response)
    }
    catch(error){

    }
}