import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Signup from './authentication/Signup'
import Login from "./authentication/Login";
import Home from "./components/Home";
import { UserProvider } from "./hooks/UserProvider";

function App() {

  return (
    <>
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Signup/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
          </Routes>
        </div>
      </Router>
      </UserProvider>
    </>
  )
}

export default App
