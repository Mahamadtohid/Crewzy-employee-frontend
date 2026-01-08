import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import EmployeeTable from "../components/EmployeeTable";
import Logout from "../components/Logout";
import TextField from '@mui/material/TextField';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await API.get(`/employees?search=${search}`);
      setEmployees(res.data);
    } catch (err) {
      console.error("FETCH EMPLOYEES ERROR:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-700">
            Employee Directory
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/add-employee")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              + Add Employee
            </button>

            <Logout />
          </div>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6 gap-2">
          {/* <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or role"
            className="w-72 px-4 py-2 border rounded-lg"
          /> */}
          <TextField id="filled-basic" value={search} 
            onChange={(e) => setSearch(e.target.value)}
          label="Filled"  placeholder="Search by name or role" variant="filled" />
          <button
            onClick={fetchEmployees}
            className="bg-indigo-500 text-white px-4 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <EmployeeTable employees={employees} />

      </div>
    </div>
  );
}

export default Dashboard;
