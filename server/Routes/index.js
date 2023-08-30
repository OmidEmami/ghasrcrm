import express from "express";
import { SendBack } from "../Controllers/TransmiterSocket.js";

const router = express.Router();
router.get('/api/call/:phone',(req,res)=>SendBack(req.params.phone,res))
export default router;