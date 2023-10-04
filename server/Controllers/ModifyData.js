import DetailedCalls from "../Models/DetailedCalls.js";
import IncomingCalls from "../Models/IncomingCalls.js";
export const regData = async(req,res)=>{
   
    try{
        const setInComingCalls = await IncomingCalls.update({
            IsResponse : 1,
        },{
            where:{
                CallId : req.body.callId
            }
        }
        )
        const setDetailedCalls = await DetailedCalls.create({
            Phone : req.body.phone,
            LastCall : req.body.lastcalldate,
            FullName : req.body.guestName,
            CallId : req.body.callId,
            FirstCall : req.body.firstcalldate,
            RequestType : req.body.requestType,
            BackGround : req.body.background,
            Result : req.body.result,
        })
        res.json("ok")
    }catch(error){

    }
}