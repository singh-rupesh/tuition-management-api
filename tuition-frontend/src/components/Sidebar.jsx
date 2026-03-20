import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { path: "/", name: "Dashboard" },
    { path: "/students", name: "Students" },
    { path: "/attendance", name: "Attendance" },
    { path: "/payments", name: "Payments" },
    { path: "/reports", name: "Reports" }
  ];

  return (
    <div style={{
      width: "240px",
      background: "#111827",
      color: "white",
      height: "100vh",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>

      <div>
        <h2>Tuition App</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((item, index) => (
            <li key={index} style={{ margin: "15px 0" }}>
              <Link
                to={item.path}
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontSize: "16px"
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#ef4444",
          color: "white",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;