import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>

      <div style={{ display: "flex" }}>

        {localStorage.getItem("token") && <Sidebar />}

        <div style={{ padding: "30px", width: "100%" }}>
          <Routes>
  <Route path="/login" element={<Login />} />

  <Route path="/" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />

  <Route path="/students" element={
    <ProtectedRoute>
      <Students />
    </ProtectedRoute>
  } />

  <Route path="/attendance" element={
    <ProtectedRoute>
      <Attendance />
    </ProtectedRoute>
  } />

  <Route path="/payments" element={
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  } />

  <Route path="/reports" element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  } />
</Routes>
        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;