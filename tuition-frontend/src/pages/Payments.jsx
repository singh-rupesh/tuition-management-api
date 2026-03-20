import { useEffect, useState } from "react";
import API from "../api";

function Payments() {

  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    student_id: "",
    amount_paid: "",
    month: "",
    year: "",
  });

  // Load students
  const fetchStudents = () => {
    API.get("/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.log(err));
  };

  // Load payments
  const fetchPayments = () => {
    API.get("/payments")
      .then((res) => setPayments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
    fetchPayments();
  }, []);

  // Handle change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit payment
  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/payments", {
      student_id: Number(form.student_id),
      amount_paid: Number(form.amount_paid),
      month: Number(form.month),
      year: Number(form.year),
    })
      .then(() => {
        alert("Payment added ✅");
        setForm({
          student_id: "",
          amount_paid: "",
          month: "",
          year: "",
        });
        fetchPayments(); // refresh table
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow flex gap-3 mb-6"
      >

        <select
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          name="amount_paid"
          placeholder="Amount"
          value={form.amount_paid}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />

        <input
          name="month"
          placeholder="Month"
          value={form.month}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />

        <input
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />

        <button className="bg-green-500 text-white px-5 rounded hover:bg-green-600">
          Add
        </button>

      </form>

      {/* ✅ Payment Table */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Student</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Month</th>
            <th className="p-3">Year</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {students.find(s => s.id === p.student_id)?.name || "Unknown"}
              </td>
              <td className="p-3">₹{p.amount_paid}</td>
              <td className="p-3">{p.month}</td>
              <td className="p-3">{p.year}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Payments;