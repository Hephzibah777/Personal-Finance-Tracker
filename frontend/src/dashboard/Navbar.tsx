import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HistoryIcon from "@mui/icons-material/History";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
interface statusType{
    option:React.Dispatch<React.SetStateAction<string>>
}
const Navbar:React.FC<statusType>=({option})=>{
    const [state, setState]=useState("");
const navigate = useNavigate();

    const handleState=(value:string)=>{
        console.log(value);
        option(value);
    }

    const handleLogOut=async()=>{
      try{
        const response=await axios.post("http://localhost:4000/logout",{}, {withCredentials:true});
        if(response.status==200){
          navigate("/login");
        }
      }
      catch(error){
        console.log(error);
      }
    }
  return (
    <>
      <div className="flex justify-start bg-blue-950 text-white border-r-5 border-gray-300 w-1/6 h-screen p-7">
        <div className="">
          <div className="flex gap-3">
            <div className="mt-1 ">
              <SpeakerNotesIcon />
            </div>
            <h1 className="text-2xl font-bold">Fundcy</h1>
          </div>
          <div className="mt-10">
            <h1>MENU</h1>
            <div className="mt-2">
              <div className="flex gap-2 hover:bg-blue-300 p-3 pr-30 rounded cursor-pointer" onClick={() => handleState("Dashboard")}>
                <DashboardIcon />
                <h3>Dashboard</h3>
              </div>
              <div className="flex gap-2 hover:bg-blue-300 p-3 pr-30 rounded cursor-pointer" onClick={() => handleState("Transactions")}>
                <ReceiptIcon />
                <h3>Transactions</h3>
              </div>

            </div>
          </div>
          <div className="mt-50">
            <h1>TOOLS</h1>
            <div className="ml-2">
               <div className="mt-4">
                    <div className="flex gap-3 hover:bg-blue-300 p-3 pr-30 rounded cursor-pointer">
                        <SettingsSuggestIcon/>
                        <h2>Settings</h2>
                    </div>
                    <div className="flex gap-3  hover:bg-blue-300 p-3 pr-30 rounded cursor-pointer">
                        <HelpIcon/>
                        <h2>HelpCenter</h2>
                    </div>
                    <div className="flex gap-3 hover:bg-blue-300 p-3 pr-30 rounded cursor-pointer">
                        <LogoutIcon/>
                        <h2 onClick={handleLogOut}>LogOut</h2>
                    </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
