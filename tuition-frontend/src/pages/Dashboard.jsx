import { useState, useEffect } from "react";
import API from "../api";

function Dashboard() {

  const [stats, setStats] = useState({
    students: 0,
    attendance: 0
  });

  // ✅ Fetch data
  useEffect(() => {

    // Get students count
    API.get("/students")
      .then(res => {
        setStats(prev => ({
          ...prev,
          students: res.data.length
        }));
      });

    // Get today's attendance
    const today = new Date().toISOString().split("T")[0];

    API.get(`/attendance?date=${today}`)
      .then(res => {
        setStats(prev => ({
          ...prev,
          attendance: res.data.length
        }));
      });

  }, []);

  // ✅ IMPORTANT: return UI
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

  <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

  <div className="grid grid-cols-4 gap-6">

    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">Total Students</h3>
      <p className="text-3xl font-bold mt-2">{stats.students}</p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">Present Today</h3>
      <p className="text-3xl font-bold mt-2">{stats.attendance}</p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">Revenue</h3>
      <p className="text-3xl font-bold mt-2 text-green-600">₹0</p>
    </div>

    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">Pending Fees</h3>
      <p className="text-3xl font-bold mt-2 text-red-500">₹0</p>
    </div>

  </div>

</div>
  );
}

export default Dashboard;