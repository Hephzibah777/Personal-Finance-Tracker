import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import AddTrans from "./AddItem/AddTrans";
import History from "./AddItem/History";
import updateType from "../interfaces/updateType";
function Transaction(){
    const [incomeprop, SetIncomeProp]=useState<updateType>({type:"", id:-1});
    useEffect(()=>{
        console.log(incomeprop);
    }, [incomeprop, SetIncomeProp])
    return(
        <>
        <div className="relative w-5/6 ">
           <div className="flex gap-7 justify-between  p-10 m-10 h-7/8  rounded-3xl">
          <AddTrans edit={incomeprop}/>
          <History edit={SetIncomeProp}/>
           </div>
        </div>
        </>
    )
}

export default Transaction; 