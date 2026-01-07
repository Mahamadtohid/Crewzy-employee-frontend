import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    const res = await API.get(`/employees?search=${search}`);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>

      <input
        placeholder="Search by name or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={fetchEmployees}>Search</button>

      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.name} | {emp.role} | {emp.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
