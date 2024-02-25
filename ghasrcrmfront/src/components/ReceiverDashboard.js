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
      width: '80%', // Adjust the width as needed
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
    const [customerSource, setCustomerSource] = useState('')
    
    const [isModalOpen, setIsModalOpen] = useState({type : '', status : false ,
     callid : '', phone :'' , lastcall:'', fullname:'',
     firstcall:'',requesttype:'',background:'', result:''})
     
    useEffect(() => {
        const socket = io.connect("http://localhost:3001");

        socket.on("receive_message", (data) => {
          setMessageReceived(prevArray => [...prevArray, data]);
          notify( "تماس جدید دریافت شد", "success");
          
        
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
        var CallId;
        
        if(typeof(isModalOpen.data.serverRes) === "object" && !isModalOpen.data.serverRes.length >0){
             CallId = isModalOpen.data.serverRes.CallId
            
        }else{
           CallId = isModalOpen.data.serverRes[0].CallId
           
        }
        
        const response = await axios.post("http://localhost:3001/api/regData",{
          callId : CallId,
          guestName : guestName,
          requestType : guestRequestType,
          result : guestResult,
          background : guestBackGround,
          phone : guestPhone,
          lastcalldate : m.locale('fa').format('YYYY/MM/DD HH:mm:ss'),
          firstcalldate : firstCallDate,
          customerSource : customerSource
        })
      
        if(response.data === "ok"){
          notify( "اطلاعات ثبت شد.", "success");
          
         
          const targetValue = isModalOpen.phone
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
            setCustomerSource('')
           
            for(let i = 0 ; i < messageReceived.length ; i++){
              console.log(targetValue)
              if(typeof(messageReceived[i].serverRes) === "object" && !messageReceived[i].serverRes.length >0){
                if(messageReceived[i].serverRes.Phone === targetValue){
                  messageReceived.splice(i , 1)
                }
              }else{
                if(messageReceived[i].serverRes[0].Phone === targetValue){
                  messageReceived.splice(i , 1)
                }
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
     
      
      if(typeof(data.serverRes) === "object" && !data.serverRes.length >0){
        setIsModalOpen({type :"haveBackGround",
      status : true, data : data, phone : data.serverRes.Phone})
      setGuestName(data.serverRes.FullName)
      setGuestPhone(data.serverRes.Phone)
      setGuestLastCall(data.serverRes.LastCall)
      setGuestCallId(data.serverRes.CallId)
      setGuestFirstCall(data.serverRes.FirstCall)
      setGuestRequestType(data.serverRes.RequestType)
      setGuestBackGround(data.serverRes.BackGround)
      setGuestResult(data.serverRes.Result)
      setCustomerSource(data.serverRes.customerSource)
      }else{
        setIsModalOpen({type :"haveBackGround",
      status : true, data : data, phone : data.serverRes[0].Phone})
        setGuestName(data.serverRes[0].FullName)
        setGuestPhone(data.serverRes[0].Phone)
        setGuestRequestType(data.serverRes[data.serverRes.length - 1].RequestType)
        setGuestResult(data.serverRes[data.serverRes.length - 1].Result)
        setGuestCallId(data.serverRes[0].CallId)
        setCustomerSource(data.serverRes[0].customerSource)
      }
    }else{
      
      setIsModalOpen({type :"firstCall",
      status : true, data : data, phone : data.serverRes.Phone
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
        setCustomerSource('')
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
          <div style={{display:"flex", flexDirection:"row",justifyContent: "center",alignItems: "center", columnGap:"5px"}}>
            {isModalOpen.data !== '' &&  <>
            
            <label>نام مهمان</label>
            <input placeholder="نام مهمان" value={guestName} onChange={(e)=>setGuestName(e.target.value)} /></>}
            {isModalOpen.data !== '' && <>
            <label>شماره تماس</label>
            <input type="text" placeholder="شماره تماس" value={guestPhone} onChange={(e)=>setGuestPhone(e.target.value)} />
            </> }
            <label>نوع درخواست</label>
            <select
        id="selectBox1"
        value={guestRequestType}
        onChange={(e)=>setGuestRequestType(e.target.value)}>
          {guestRequestType === '' && <option value="">نوع درخواست را انتخاب کنید</option>}
          {guestRequestType !== '' && <option value={guestRequestType}>{guestRequestType}</option>}
        <option value="رستوران">رستوران</option>
        <option value="اقامت">اقامت</option>
        <option value="حمام سنتی">حمام سنتی</option>
        <option value="سایر">سایر</option>
      </select>
      
              <lable>نتیجه</lable>
              <select
        id="selectBox2"
        value={guestResult}
        onChange={(e)=>setGuestResult(e.target.value)}>
          {guestResult === '' && <option value="">نتیجه تماس را مشخص کنید</option>}
          {guestResult !== '' && <option value={guestResult}>{guestResult}</option>}
        <option value="بررسی لیست قیمت ها">بررسی لیست قیمت ها</option>
        <option value="بررسی قیمت و ظرفیت">بررسی قیمت و ظرفیت</option>
        <option value="ارسال کاتالوگ">ارسال کاتالوگ</option>
        <option value="رزرو انجام شد">رزرو انجام شد</option>
        <option value="ارجاع به رستوران">ارجاع به رستوران</option>
        <option value="ارجاع به حمام">ارجاع به حمام</option>
        <option value="سایر">سایر</option>
      </select>
      <label>نحوه آشنایی</label>
      <select
        id="selectBox3"
        value={customerSource}
        onChange={(e)=>setCustomerSource(e.target.value)}>
          {customerSource === '' && <option value="">نحوه آشنایی</option>}
          {customerSource !== '' && <option value={customerSource}>{customerSource}</option>}
        <option value="اینستاگرام">اینستاگرام</option>
        <option value="اینترنت">اینترنت</option>
        <option value="آژانس">مهمان قبلی</option>
        <option value="سایر">سایر</option>
      </select>
      </div>
      
            {isModalOpen.type === "haveBackGround" &&
            <div className={styles.gridContainer}>
            {isModalOpen.data.serverRes.map((value, index) => (
              <div key={index} className={styles.dataContainer}>
                <h3>تاریخ تماس :  {value.LastCall}</h3>
                <h3>نوع درخواست : {value.RequestType}</h3>
                <h3>نتیجه : {value.Result}</h3>
                <div className={styles.divider}></div>
              </div>
            ))}
          </div>
            }
           
            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",columnGap:"2vw"}}>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              
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
            
            {typeof(info.serverRes) === "object" && !info.serverRes.length >0 ? <div className={styles.CallerContainer}>شماره تماس : {info.serverRes.Phone}</div> :
            <div className={styles.CallerContainer}>شماره تماس : {info.serverRes[0].Phone}</div>}
       
       {typeof(info.serverRes) === "object" && !info.serverRes.length >0 ? 
       <div className={styles.CallerContainer}>Call Id : {info.serverRes.CallId}</div>:
       <div className={styles.CallerContainer}>Call Id : {info.serverRes[0].CallId}</div>}
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