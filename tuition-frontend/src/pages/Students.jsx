import { useEffect, useState } from "react";
import API from "../api";

function Students() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    fee_per_day: "",
  });

  // Load students
  const fetchStudents = () => {
    API.get("/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/students", {
      name: form.name,
      phone: form.phone,
      fee_per_day: Number(form.fee_per_day),
      join_date: new Date().toISOString().split("T")[0],
    })
      .then(() => {
        alert("Student added ✅");
        setForm({ name: "", phone: "", fee_per_day: "" });
        fetchStudents();
      })
      .catch((err) => console.log(err));
  };

  // ✅ DELETE FUNCTION (CORRECT PLACE)
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    API.delete(`/students/${id}`)
      .then(() => {
        alert("Deleted successfully ✅");
        fetchStudents();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow flex gap-3 mb-6"
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="fee_per_day"
          placeholder="Fee per day"
          value={form.fee_per_day}
          onChange={handleChange}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="bg-blue-500 text-white px-5 rounded hover:bg-blue-600 transition">
          Add
        </button>
      </form>

      {/* Table */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-200 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Fee</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.phone}</td>
              <td className="p-3">₹{s.fee_per_day}</td>
              <td className="p-3">
                {/* ✅ DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;