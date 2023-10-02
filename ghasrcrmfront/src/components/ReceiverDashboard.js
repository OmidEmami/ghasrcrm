import React, { useState,useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import styles from "./ReceiverDashboard.module.css";
import { FcCallback } from "react-icons/fc";
import { notify } from "./toast";
import Modal from 'react-modal';
import moment from 'jalali-moment'
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
     const optionsSelectBox = [
      'رستوران',
      'اقامت',
      'حمام سنتی',
      'سایر',
    ];
    useEffect(() => {
        const socket = io.connect("http://localhost:3001");
    
        socket.on("receive_message", (data) => {
          setMessageReceived(prevArray => [...prevArray, data]);
          notify( "تماس جدید دریافت شد", "success");
          if (data.type === "haveBackGround"){
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
          
        });
    
        return () => {
          socket.disconnect(); // Clean up the socket connection when the component unmounts
        };
      }, []);
      
   
  
    const regData = async(e) =>{
      var firstCallDate = '';
      if(guestFirstCall === ''){
        firstCallDate = m.locale('fa').format('YYYY-MM-DD')
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
          lastcalldate : m.locale('fa').format('YYYY-MM-DD'),
          firstcalldate : firstCallDate,
        })
        if(response.data === "ok"){
          notify( "اطلاعات ثبت شد.", "success");
          setIsModalOpen({type :"",
            status : false, callid : '', phone :'',
            lastcall: '', fullname : '' , 
            firstcall : '' , requesttype: '',
            background : '', result: ''
            })
        }else{
          notify( "خطا", "error");
        }
      }catch{

      }
    }
  const openModalRegData = async(info)=>{
    setIsModalOpen({status : true, callid : info.callId, phone :info.Phone, })
    // status : false , callid : '', phone :'' , lastcall:'', fullname:'',firstcall:'',requesttype:'',background:"", result:''
  }
    return(
        <div>
          <Modal
        isOpen={isModalOpen.status}
        //onAfterOpen={afterOpenModal}
        onRequestClose={()=>setIsModalOpen({type : "", status : false ,
        callid : '', phone :'' , lastcall:'', fullname:'',
        firstcall:'',requesttype:'',background:"", result:''})}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h1>asdadadad</h1>
          <p>call id : {guestCallId}</p>
          <form onSubmit={(e)=>regData(e)}>
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
            
            <div>
              <label>سوابق قبلی</label>
              <textarea value={guestBackGround}
              onChange={(e)=>setGuestBackGround(e.target.value)}
              rows={5} column={20} type="text"></textarea>
            </div>
            
            
            <div>
              <lable>نتیجه</lable>
              <textarea value={guestResult}
              onChange={(e)=>setGuestResult(e.target.value)}
              rows={5} column={20} type="text"></textarea>
            </div>
            
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
       <div className={styles.CallerContainer}>شماره تماس : {info.serverRes.Phone}</div>
       <div className={styles.CallerContainer}>Call Id : {info.serverRes.CallId}</div>
       <div className={styles.CallerContainer}>تاریخ و زمان تماس : {info.serverRes.Time}</div>
        <div style={{display:"flex",justifyContent: "space-between",alignItems: "center",margin:"10px"}}>
            <button onClick={(info)=>openModalRegData(info)}>ثبت اطلاعات</button>
            <button>عدم پاسخ</button>
            </div>
       </div>
      ))}
    </div>
     </div>
    )
   
}
export default ReceiverDashboard