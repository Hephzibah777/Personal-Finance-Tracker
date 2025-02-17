import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import incomeDataType from "../../interfaces/incomeDataType";
import updateType from "../../interfaces/updateType";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ComponentType{
    edit:React.Dispatch<React.SetStateAction<updateType>>
}
const IncomeHistory:React.FC<ComponentType>=({edit})=>{
    const[incomeData, setIncomeData]=useState<incomeDataType[]>([]);

    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  useEffect(()=>{
     const fetchData=async()=>{
      try{
          const response=await axios.get("http://localhost:4000/incomes", config)
          console.log(response.data);
          setIncomeData(response.data);
      }
      catch(error){
          alert(error);
      }
     }
     fetchData();
  }, [])

  const handleEdit=(value:number)=>{
    edit({type:"income", id:value});
  }

  const handleDelete=async(value:number)=>{
    try{
      const response=await axios.delete(`http://localhost:4000/incomes/${value}`, config)
      if(response.status==200){
          toast.success("Deleted successfully !", {
                  position: "top-right",
                  autoClose: 2000,
                });
      }
    }
    catch(error){
      toast.error("Something went wrong. Please check your internet connection and try again!", {
             position: "top-center",
           });
    }
  }

    return(
        <>
         <div className="relative w-full h-3/4 mt-5 overflow-y-scroll overflow-x-none">
          <table className="border">
            <thead>
                <tr>
                <th className="p-2 pl-20 pr-20 border border-gray-400">Amount</th>
                <th className="p-2 pl-20 pr-20 border border-gray-400">Description</th>
                <th className="p-2 pl-30 pr-30 border border-gray-400">Actions</th>
                </tr>
                
            </thead>
            <tbody>
            {incomeData.map((key)=>(
                          <tr key={key.id}>
                          <td className="border p-4 border-gray-400">{key.amount}</td>
                          <td className="border p-4 border-gray-400">{key.description}</td>
                          <td className="border p-4 border-gray-400">
                              <div className="flex gap-3">
                                  <button className="border border-green-600 p-3 pl-10 pr-10 rounded-2xl cursor-pointer" onClick={() => handleEdit(key.id as number)}>Edit</button>
                                  <button className="border border-red-600 p-3 pl-10 pr-10 rounded-2xl cursor-pointer" onClick={() => handleDelete(key.id as number)}>Delete</button>
                              </div>
                          </td>
                      </tr>
                    ))}
              
            </tbody>
          </table>
          <ToastContainer />
        </div>
        </>
    )
}

export default IncomeHistory; 