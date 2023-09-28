import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./Routes/index.js";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import multer from "multer";
import moment from 'jalali-moment';
import path from "path";
import fs from 'fs';
import axios from "axios";

dotenv.config();
const app = express();
const corsOptions = {
  origin: ['http://localhost:3000','http://87.248.152.131','https://gmhotel.ir']
  , // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you're using cookies or sessions
};

app.use(cors(corsOptions));
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use(cookieParser());
app.use(express.json());
app.use(router);

io.on("connection", (socket) => {
  //socket.emit("receive_message","omid")
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.listen(PORT, ()=> console.log('Server running at port 3001'));
function transmitData (params){
  io.local.emit("receive_message", params);

  }
  export default transmitData;






