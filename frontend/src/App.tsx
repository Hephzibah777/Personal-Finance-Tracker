import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './authentication/Signup'
import Login from "./authentication/Login";
import Home from "./components/Home";
import { UserProvider } from "./hooks/UserProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* Correct way: Wrap ProtectedRoute inside Route */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
