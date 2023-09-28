import React, { useState,useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ReceiverDashboard.module.css";
import { FcCallback } from "react-icons/fc";
import { notify } from "./toast";
import Modal from 'react-modal';
const ReceiverDashboard =()=>{
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };    
    const socket = io.connect("http://localhost:3001");
    const [data,setData] = useState("")
    
    const [loading, setLoading] = useState(false)

    const [messageReceived, setMessageReceived] = useState([]);
    const [tartib, setTartib] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState({status : false , callid : ''})
    useEffect(() => {
        const socket = io.connect("http://localhost:3001");
    
        socket.on("receive_message", (data) => {
          setMessageReceived(prevArray => [...prevArray, data]);
          notify( "تماس جدید دریافت شد", "success")
          
        });
    
        return () => {
          socket.disconnect(); // Clean up the socket connection when the component unmounts
        };
      }, []);
      
   
  
    const regData = async(callId) =>{
      try{
        const response = await axios.post("http://localhost:3001/api/regData",{
          callId : callId.status
        })
      }catch{

      }
    }
  const openModalRegData = async(callid)=>{
    setIsModalOpen({status : true, callid : callid})
  }
    return(
        <div>
          <Modal
        isOpen={isModalOpen.status}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setIsModalOpen({status : false , callid :''})}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h1>asdadadad</h1>
          <form onSubmit={(isModalOpen)=>regData(isModalOpen)}>
           <label>نام مهمان</label>
            <input placeholder="نام مهمان" />
            <button type="submit">ثبت</button>
          </form>
        </div>
        
      </Modal>
            <h1>تماس های دریافتی</h1>
            <div className={styles.wrapContainer}>
      
      {messageReceived.length > 0 && messageReceived.map((info,index)=>(
        
       <div className={styles.divMainContainer}>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
            <FcCallback size={45} />
            <div>ترتیب : {index + 1}</div>
            </div>
       <div className={styles.CallerContainer}>شماره تماس : {info.Phone}</div>
       <div className={styles.CallerContainer}>Call Id : {info.CallId}</div>
       <div className={styles.CallerContainer}>تاریخ و زمان تماس : {info.Time}</div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
            <button onClick={(info)=>openModalRegData(info.CallId)}>ثبت اطلاعات</button>
            <button>عدم پاسخ</button>
            </div>
       </div>
      ))}
    </div>
     </div>
    )
   
}
export default ReceiverDashboard