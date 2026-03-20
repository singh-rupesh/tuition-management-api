import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();   // ✅ ADD THIS

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", form.username);
    formData.append("password", form.password);

    API.post("/login", formData, {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
})
.then(res => {
  localStorage.setItem("token", res.data.access_token);
  alert("Login successful ✅");
  navigate("/students");
})
.catch(err => {
  console.log(err);
  alert("Invalid username or password ❌");
});
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;