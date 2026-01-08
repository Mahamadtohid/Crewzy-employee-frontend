import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    date_joined: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/employees", form);
      alert("Employee added successfully");
      navigate("/"); // 🔁 redirect back to dashboard
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-green-600 mb-6">
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            name="role"
            placeholder="Role"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date_joined"
            className="w-full px-4 py-2 border rounded-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Save Employee
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
