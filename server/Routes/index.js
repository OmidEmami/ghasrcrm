import express from "express";
import { SendBack } from "../Controllers/TransmiterSocket.js";
import { regData } from "../Controllers/ModifyData.js";
import { getMissedCalls } from "../Controllers/GetMissedCalls.js";
const router = express.Router();
router.get('/api/call/:phone',(req,res)=>SendBack(req.params.phone,res))
router.post('/api/regData', regData)
router.get('/api/getmissedcalls', getMissedCalls)
export default router;