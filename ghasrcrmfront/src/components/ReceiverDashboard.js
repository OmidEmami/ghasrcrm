import React, { useState,useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ReceiverDashboard.module.css";
import { FcCallback } from "react-icons/fc";
import { notify } from "./toast";
import Modal from 'react-modal';
import moment from 'jalali-moment';
import Button from '@mui/material/Button';
const ReceiverDashboard =()=>{
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%', // Adjust the width as needed
    },
  };
    const socket = io.connect("http://localhost:3001");
    const [data,setData] = useState("")
    const m = moment();
    const [loading, setLoading] = useState(false)
    const [guestName,setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestLastCall, setGuestLastCall] = useState('');
    const [guestCallId, setGuestCallId] = useState('');
    const [guestFirstCall, setGuestFirstCall] = useState('');
    const [guestRequestType, setGuestRequestType] = useState('');
    const [guestBackGround, setGuestBackGround] = useState('');
    const [guestResult, setGuestResult] = useState('')
    const [messageReceived, setMessageReceived] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState({type : '', status : false ,
     callid : '', phone :'' , lastcall:'', fullname:'',
     firstcall:'',requesttype:'',background:'', result:''})
     
    useEffect(() => {
        const socket = io.connect("http://localhost:3001");

        socket.on("receive_message", (data) => {
          setMessageReceived(prevArray => [...prevArray, data]);
          notify( "تماس جدید دریافت شد", "success");
          
          console.log(data)
        });
    
        return () => {
          socket.disconnect(); // Clean up the socket connection when the component unmounts
        };
      }, []);
      
   
  
    const regData = async(e) =>{
      var firstCallDate = '';
      if(guestFirstCall === ''){
        firstCallDate = m.locale('fa').format('YYYY/MM/DD HH:mm:ss')
      }
      e.preventDefault();
      try{
        const response = await axios.post("http://localhost:3001/api/regData",{
          callId : isModalOpen.callid,
          guestName : guestName,
          requestType : guestRequestType,
          result : guestResult,
          background : guestBackGround,
          phone : guestPhone,
          lastcalldate : m.locale('fa').format('YYYY/MM/DD HH:mm:ss'),
          firstcalldate : firstCallDate,
        })
        if(response.data === "ok"){
          notify( "اطلاعات ثبت شد.", "success");
          const targetValue = isModalOpen.callid
          setIsModalOpen({type :"",
            status : false, callid : '', phone :'',
            lastcall: '', fullname : '' , 
            firstcall : '' , requesttype: '',
            background : '', result: ''
            })
            setGuestName('')
            setGuestPhone('')
            setGuestLastCall('')
            setGuestCallId('')
            setGuestFirstCall('')
            setGuestRequestType('')
            setGuestBackGround('')
            setGuestResult('')
            for(let i = 0 ; i < messageReceived.length ; i++){
              if(messageReceived[i].serverRes.CallId === targetValue){
                messageReceived.splice(i , 1)
              }
            }
            
        }else{
          notify( "خطا", "error");
        }
      }catch{

      }
    }
  const openModalRegData = async(data,index)=>{
    
  
    if (data.type === "haveBackGround"){
      console.log("havebackground")
      setIsModalOpen({type :"haveBackGround",
      status : true, callid : data.serverRes.CallId, phone :data.serverRes.Phone,
      lastcall: data.serverRes.LastCall, fullname : data.serverRes.FullName , 
      firstcall : data.serverRes.FirstCall , requesttype: data.serverRes.RequestType,
      background : data.serverRes.BackGround, result: data.serverRes.Result
      })
      setGuestName(data.serverRes.FullName)
      setGuestPhone(data.serverRes.Phone)
      setGuestLastCall(data.serverRes.LastCall)
      setGuestCallId(data.serverRes.CallId)
      setGuestFirstCall(data.serverRes.FirstCall)
      setGuestRequestType(data.serverRes.RequestType)
      setGuestBackGround(data.serverRes.BackGround)
      setGuestResult(data.serverRes.Result)
    }else{
      
      setIsModalOpen({type :"firstCall",
      status : true, callid : data.serverRes.CallId, phone :data.serverRes.Phone,
      })
      setGuestPhone(data.serverRes.Phone)
      setGuestCallId(data.serverRes.CallId)
      
    }
  
  }
  const closeModalRegData =()=>{
    setIsModalOpen({type : "", status : false ,
        callid : '', phone :'' , lastcall:'', fullname:'',
        firstcall:'',requesttype:'',background:"", result:''})
        setGuestName('')
        setGuestPhone('')
        setGuestLastCall('')
        setGuestCallId('')
        setGuestFirstCall('')
        setGuestRequestType('')
        setGuestBackGround('')
        setGuestResult('')
  }
  const closeRegData = (info,index) =>{
    const targetValue = info.serverRes.CallId;
    
    for(let i = 0 ; i < messageReceived.length ; i++){
     
      if(messageReceived[i].serverRes.CallId === targetValue){
     var tempmessage = [...messageReceived]
        tempmessage.splice(i , 1)
        setMessageReceived(tempmessage)
        notify("تماس بسته شد", "error")
      }
    }

  }
    return(
        <div>
          <Modal
        isOpen={isModalOpen.status}
        
        onRequestClose={()=>setIsModalOpen({type : "", status : false ,
        callid : '', phone :'' , lastcall:'', fullname:'',
        firstcall:'',requesttype:'',background:"", result:''})}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{display:"flex", flexDirection:"column",justifyContent: "center",alignItems: "center"}}>
          <h1>ثبت و ویرایش اطلاعات مشتری</h1>
          <p>call id : {guestCallId}</p>
          <form className={styles.regDataForm} onSubmit={(e)=>regData(e)}>
          <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center"}}>
            {isModalOpen.fullname !== '' &&  <>
            
            <label>نام مهمان</label>
            <input placeholder="نام مهمان" value={guestName} onChange={(e)=>setGuestName(e.target.value)} /></>}
            {isModalOpen.phone !== '' && <>
            <label>شماره تماس</label>
            <input type="text" placeholder="شماره تماس" value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)} />
            </> }
            <label>نوع درخواست</label>
            <select
        id="selectBox"
        value={guestRequestType}
        onChange={(e)=>setGuestRequestType(e.target.value)}>
          {guestRequestType === '' && <option value="">نوع درخواست را انتخاب کنید</option>}
          {guestRequestType !== '' && <option value={guestRequestType}>{guestRequestType}</option>}
        <option value="رستوران">رستوران</option>
        <option value="اقامت">اقامت</option>
        <option value="حمام سنتی">حمام سنتی</option>
        <option value="سایر">سایر</option>
      </select>
      </div>
            {guestLastCall !== '' &&
            <div>
            <label>تاریخ آخرین تماس</label>
            {guestLastCall}
            </div>
            }
            {guestFirstCall !== '' &&
            <div>
            <label>تاریخ اولین تماس</label>
            {guestFirstCall}
            </div>
            }
            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",columnGap:"2vw"}}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              <label>سوابق قبلی</label>
              <textarea value={guestBackGround}
              onChange={(e)=>setGuestBackGround(e.target.value)}
              rows={5} column={20} type="text"></textarea>
            </div>
            
            
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              <lable>نتیجه</lable>
              
              <textarea value={guestResult}
              onChange={(e)=>setGuestResult(e.target.value)}
              rows={5} column={20} type="text"></textarea>
            </div>
            </div>
            
            <div style={{margin:"1vw",display:"flex", flexDirection:"row",justifyContent: "center", alignItems: "center", columnGap:"1vw"}}>
            <Button type="submit"  sx={{fontFamily:"shabnam"}} variant="outlined">ثبت</Button>
            <Button  sx={{fontFamily:"shabnam"}} onClick={closeModalRegData} variant="outlined">بستن</Button>
            </div>
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
       <div className={styles.CallerContainer}>شماره تماس : {info.serverRes.Phone}</div>
       <div className={styles.CallerContainer}>Call Id : {info.serverRes.CallId}</div>
       <div className={styles.CallerContainer}>تاریخ و زمان تماس : {info.Time}</div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
        <Button sx={{fontFamily:"shabnam"}} onClick={()=>openModalRegData(info,index)} variant="outlined">ثبت اطلاعات</Button>

        <Button sx={{fontFamily:"shabnam"}} onClick={()=>closeRegData(info,index)} variant="outlined">عدم پاسخ</Button>

            
            </div>
       </div>
      ))}
    </div>
     </div>
    )
   
}
export default ReceiverDashboard;