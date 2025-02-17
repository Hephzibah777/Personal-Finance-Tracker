import React from "react";
import axios from "axios";
import { useState } from "react";
import Navbar from "./Navbar";
import Transaction from "./Transaction";
import Analysis from "./Analysis";
function Home(){
    const [status, setStatus]=useState("Transactions");
    return(
        <>
        <div className="flex">
            <Navbar option={setStatus}/>
            {status=="Dashboard"? <Analysis/> : <Transaction/>}
        </div>
        </>
    )
}

export default Home; 