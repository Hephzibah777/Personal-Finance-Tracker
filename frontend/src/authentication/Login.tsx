import React from 'react'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import loginType from '../interfaces/loginType';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from '@mui/icons-material/Visibility';

const Login=()=>{
     const [loginData, setLoginData]=useState<loginType|null>(null);
     const [showPassword, setShowPassword]=useState(false);

     const navigate = useNavigate();
     const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const name=event.target.name;
        const value=event.target.value;
        setLoginData(values=>({...values, [name]:value} as loginType));
     }

     const onSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        try{
            const response = await axios.post('http://localhost:4000/login', loginData);
           if(response.status==200){
            toast.success("Login Successfull !", {
                        position: "top-right",
                        autoClose:2000,
                      });
            Cookies.set('authToken', response.data.token, { 
                expires: 7, 
                secure: true,
                sameSite: 'strict'
              });
              setTimeout(()=>navigate("/home"), 2000);
           }
           else if(response.status==400){
            toast.error("Wrong Password!", {
                position: "top-center",
              });
           }

        }
        catch(error){
            toast.error("Login Failed! Try Again", {
                position: "top-center",
              });
        }
     }

    return (
        <>
       <div className='flex'>
        <div className='w-3/5 h-screen bg-[url(budget.jpg)] bg-contain bg-fixed bg-no-repeat'>
        </div>
        <div className='p-15 w-2/5 font-bold '>
        <div className='flex justify-end'>
            <p>Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => navigate("/")}>Sign Up</span></p>
           </div>
           <form onSubmit={onSubmit}>
           <div className='ml-15 mt-15'>
            <h1 className='text-5xl'>Log In</h1>
            <p className='mt-5 text-gray-400'>Plan Today for a Richer Tomorrow</p>
            <div className='mt-10 w-4/5'>
                <div className='mb-13'>
                    <div>
                        <AlternateEmailIcon className='mr-5'/>
                    <input placeholder='Email' className='outline-none' value={loginData?.email} onChange={handleChange} name="email"/>
                    </div>
                    <hr className='mt-2'></hr>
                </div>
                <div className='mb-13'>
                    <div className='flex justify-between'>
                    <div>
                        <LockOpenIcon className='mr-5'/>
                    <input placeholder='Password' type={showPassword==true?"text":"password"} 
                    className='outline-none' value={loginData?.password} onChange={handleChange} name="password"/>
                    </div>
                    <div className='cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                        <VisibilityIcon/>
                    </div>
                    </div>
                    <hr className='mt-2'></hr>
                    
                </div>
            </div>
            <div>
                <button className='bg-blue-500 pt-3 pb-3 pl-15 pr-15 text-white rounded-3xl cursor-pointer'>Log In</button>
            </div>
            <ToastContainer />
           </div>
           </form>
        </div>
       </div>
        </>
    )
}

export default Login;
