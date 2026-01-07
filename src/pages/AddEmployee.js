import React, { useState } from "react";
import API from "../services/api";

function AddEmployee() {
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
    } catch (err) {
      alert("Error adding employee");
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <br />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />
        <input name="role" placeholder="Role" onChange={handleChange} />
        <br />
        <input type="date" name="date_joined" onChange={handleChange} />
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddEmployee;
