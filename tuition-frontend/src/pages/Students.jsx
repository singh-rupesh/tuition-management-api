import { useEffect, useState } from "react";
import API from "../api";

function Students() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    fee_per_day: ""
  });

  // Load students
  const fetchStudents = () => {
    API.get("/students")
      .then(res => setStudents(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/students", {
      name: form.name,
      phone: form.phone,
      fee_per_day: Number(form.fee_per_day),
      join_date: new Date().toISOString().split("T")[0]
    })
      .then(() => {
        alert("Student added ✅");
        setForm({ name: "", phone: "", fee_per_day: "" });
        fetchStudents(); // refresh list
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>Students</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="fee_per_day"
          placeholder="Fee per day"
          value={form.fee_per_day}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Student</button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Fee Per Day</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.phone}</td>
              <td>{s.fee_per_day}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;