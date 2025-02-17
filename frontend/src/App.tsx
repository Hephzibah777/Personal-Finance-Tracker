import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import Signup from './components/Signup'
import Login from "./components/Login";
import Home from "./dashboard/Home"
function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Signup/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
