import React from "react";
import axios from "axios";
import { useState , useEffect} from "react";
import ExpenseHistory from "../AddHistory/ExpenseHistory";
import IncomeHistory from "../AddHistory/IncomeHistory";
import updateType from "../../interfaces/updateType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
interface ComponentType{
    edit:React.Dispatch<React.SetStateAction<updateType>>
}
const  History:React.FC<ComponentType>=({edit})=>{
    const [data, setData]=useState("");
     const [totalincome, setTotalIncome]=useState(0);
      const [totalexpense, setTotalExpense]=useState(0);
      const [totalbalance, setTotalBalance]=useState(0);
       const token = Cookies.get("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

    const handleChange=(event:React.ChangeEvent<HTMLSelectElement>)=>{
        event.preventDefault();
        console.log(event.target.value);
        setData(event.target.value);
    }

    useEffect(()=>{
       try{
        const fetchdata = async()=>{
            const responseincome=await axios.get(`http://localhost:4000/totalincome`,config);
            setTotalIncome(responseincome.data[0].income);
    
            const responseexpense=await axios.get(`http://localhost:4000/totalexpense`,config);
            setTotalExpense(responseexpense.data[0].expense);
          }
    
    
          fetchdata();
       }
       catch(error){
         toast.error("Something went wrong. Please check your internet connection and try again!", {
                position: "top-center",
              });
       }
          
    })

      useEffect(()=>{
        try{
          
            const calcBalance=()=>{
                const income=totalincome || 0;
                const expense=totalexpense || 0;
                const balance:number=income-expense;
                setTotalBalance(balance);
                
            }
            calcBalance();
        }
        catch(error){
    
        }
        
      })

    return(
        <>
       <div className="w-2/3 h-full bg-blue-100 shadow-lg  rounded-3xl p-10">
        <div className="w-full h-full">
            <div className="flex text-center gap-10">
            <div className="bg-blue-950 text-white w-1/3 h-1/2 p-3 rounded-2xl">
                <h1>Total Income: {totalincome}</h1>
            </div>
            <div className="bg-blue-950 text-white w-1/3 h-1/2 p-3 rounded-2xl">
                <h1>Total Expense: {totalexpense}</h1>
            </div>
            <div className="bg-blue-950 text-white w-1/3 h-1/2 p-3 rounded-2xl">
                <h1>Total Balance: {totalbalance}</h1>
            </div>
            </div>
            <div className="mt-10">
            <div className="flex gap-5">
                <select className="border p-3 border-blue-950 rounded" value={data} onChange={handleChange}>
                    <option>Expense History</option>
                    <option>Income History</option>
                </select>
            </div>
        </div>
       {data=="Income History" ? <IncomeHistory edit={edit}/>:<ExpenseHistory edit={edit}/>}
        </div>
         <ToastContainer />
       </div>
        </>
    )
}

export default History; 