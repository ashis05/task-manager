import Login from "./pages/auth/login.tsx";
import Signup from "./pages/auth/signUp.tsx";
import Dashboard from "./pages/dashBoard.tsx";
import ValidateOtp from "@/pages/auth/validateOtp.tsx";
import {Routes, Route, Navigate} from "react-router-dom";
import DashBoardLayout from "@/pages/dashBoardLayout.tsx";


function App() {
  return (
      <Routes>
          {/* 1. The default path redirects to Login (or Dashboard if logged in) */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 2. Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/validateOtp" element={<ValidateOtp />}/>

          {/* 3. The Main App Route */}
          <Route element={<DashBoardLayout/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* 4. Catch-all for 404s (Optional) */}
          <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
  )
}

export default App
