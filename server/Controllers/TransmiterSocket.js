import transmitData from "../index.js";
import IncomingCalls from "../Models/IncomingCalls.js";
import moment from "jalali-moment";
import DetailedCalls from "../Models/DetailedCalls.js"
export const SendBack = async (params,res)=>{
    const callid = Math.floor(Math.random() * 90000) + 10000
    try{
        const response = await DetailedCalls.findAll({
            where:{
                Phone : params
            }
        })
        if(response.length > 0){
            transmitData(response)
            await IncomingCalls.create({
                Phone : params,
                IsResponse : false,
                Time : moment().locale('fa').format('YYYY-MM-DD HH:mm:ss'),
                CallId : callid
            })
        }else{
            const object = {Phone : params, CallId: callid, Time : moment().locale('fa').format('YYYY-MM-DD HH:mm:ss')}
            transmitData(object)
            await IncomingCalls.create({
                Phone : params,
                IsResponse : false,
                Time : moment().locale('fa').format('YYYY-MM-DD HH:mm:ss'),
                CallId : callid
            })
        }
        
    }catch(error){
        res.status(404)
    }
    
    res.send("ok")

    

}