
/*eslint-disable*/

import React, { createContext, useState, useContext, useEffect } from 'react';
import userType from '../interfaces/userType';
import userContextType from '../interfaces/userContextType';
import Cookies from "js-cookie";
import axios from 'axios';

export const UserContext = createContext<userContextType| null>(null);

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
 
 const [user, setUser] = useState<userType|null>(null);

 const token = Cookies.get("authToken");
 const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

 useEffect(()=>{
    try{
        const fetchUserData=async()=>{
            const response=await axios.get("http://localhost:4000/user",config);
            console.log(response);
            setUser(response.data);
        }
        fetchUserData();
    }
    catch(error){
        alert("Error fetching data");
    }
 }, [])
  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext =()=>{
  const context=useContext(UserContext);
  if(!context){
    throw new Error("useFormContext");
  }
  return context;
}