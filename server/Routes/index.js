import express from "express";
import { SendBack } from "../Controllers/TransmiterSocket.js";
import { regData } from "../Controllers/ModifyData.js";
const router = express.Router();
router.get('/api/call/:phone',(req,res)=>SendBack(req.params.phone,res))
router.post('/api/regData', regData)
export default router;