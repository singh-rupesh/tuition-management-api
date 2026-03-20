import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#1f2937",
      color: "white",
      height: "100vh",
      padding: "20px"
    }}>
      <h2>Tuition App</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/" style={{color:"white"}}>Dashboard</Link></li>
        <li><Link to="/students" style={{color:"white"}}>Students</Link></li>
        <li><Link to="/attendance" style={{color:"white"}}>Attendance</Link></li>
        <li><Link to="/payments" style={{color:"white"}}>Payments</Link></li>
        <li><Link to="/reports" style={{color:"white"}}>Reports</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;