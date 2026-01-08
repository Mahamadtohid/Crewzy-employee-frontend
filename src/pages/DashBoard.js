import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import EmployeeTable from "../components/EmployeeTable";
import Logout from "../components/Logout";
import TextField from '@mui/material/TextField';
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";


function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;



  const fetchEmployees = async () => {
  try {
    const res = await API.get(
      `/employees?search=${search}&page=${page}&limit=${limit}`
    );

    setEmployees(res.data.data);   // 👈 array
    setTotal(res.data.total);      // 👈 number
  } catch (err) {
    console.error("FETCH EMPLOYEES ERROR:", err);
  }
};



  useEffect(() => {
  fetchEmployees();
}, [page]);

const totalPages = Math.ceil(total / limit);


  return (
  <div className="min-h-screen bg-slate-100 py-10 relative">
    <div className="max-w-6xl mx-auto px-4">

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-10">
        Employee Directory
      </h1>

      {/* Top controls */}
      <div className="flex justify-between items-end mb-6">

        {/* Search */}
        <div className="flex gap-2">
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Search employee"
            placeholder="Search by name or role"
            variant="filled"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchEmployees}
          >
            Search
          </Button>
        </div>

        {/* Add Employee */}
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/add-employee")}
        >
          + Add Employee
        </Button>
      </div>

      {/* Table */}
      <EmployeeTable employees={employees} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </div>
      )}

    </div>
  </div>
);
}

export default Dashboard;
