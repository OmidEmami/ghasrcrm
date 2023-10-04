import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { notify } from './toast';
import MissedCallsComponent from './MissedCallsComponent';
const MissedCalls = () => {
    const [missedCalls , setMissedCalls] = useState([])
    useEffect(() => {

        async function getMissedCalls(){
            try{
                const response = await axios.get("http://localhost:3001/api/getmissedcalls");
                setMissedCalls(response.data)
                notify("اطلاعات با موفقیت دریافت شد", "success")
            }catch(error){
                notify("خطا", "error")
            }
        }
       
        getMissedCalls();
      }, []);
  return (
    <div>
      {missedCalls.length > 0 ? <MissedCallsComponent data={missedCalls} /> : <p>loading</p>}
    </div>
  )
}

export default MissedCalls
