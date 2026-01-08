import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import EmployeeTable from "../components/EmployeeTable";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  Box,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Person,
  Email,
  Work,
  CalendarToday,
  Close,
  AdminPanelSettings,
} from "@mui/icons-material";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const userRole = localStorage.getItem("userrole");
  const isAdmin = userRole === "Admin";

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Dialog state (Admin only)
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    userrole: "",
    date_joined: "",
  });

  const userRoles = ["admin", "user"];

  // URL params
  const search = searchParams.get("search") || "";
  const filterBy = searchParams.get("filter_by") || "all";
  const page = Number(searchParams.get("page")) || 1;

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  /* ================= FETCH EMPLOYEES ================= */
  const fetchEmployees = async () => {
    try {
      const res = await API.get(
        `/employees?search=${search}&filter_by=${filterBy}&page=${page}&limit=${limit}`
      );

      const employeesData = res.data?.data || res.data || [];
      const totalData = res.data?.total || employeesData.length;

      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setTotal(totalData);
    } catch (err) {
      console.error("Error fetching employees:", err.response?.data || err);
      setEmployees([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, filterBy, page]);

  /* ================= SEARCH / FILTER ================= */
  const handleSearch = () => {
    setSearchParams({ search, filter_by: filterBy, page: 1 });
  };

  const handleReset = () => {
    setSearchParams({ search: "", filter_by: "all", page: 1 });
  };

  /* ================= SORT ================= */
  const handleSortChange = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedEmployees = sortConfig.key
    ? [...employees].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "date_joined") {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : employees;

  const handleOpenDialog = () => {
    if (!isAdmin) return;
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({
      name: "",
      email: "",
      role: "",
      userrole: "",
      date_joined: "",
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD EMPLOYEE (ADMIN ONLY) ================= */
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert("You are not authorized to add employees");
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.role ||
      !form.userrole ||
      !form.date_joined
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        userrole: form.userrole,
        date_joined: form.date_joined,
      };

      await API.post("/employees", payload);
      alert("Employee added successfully");
      handleCloseDialog();
      fetchEmployees();
    } catch (err) {
      console.error("Add employee error:", err.response?.data || err);
      alert("Failed to add employee");
    }
  };

 

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Search Bar */}
            <Box
              sx={{
                position: "relative",
                maxWidth: "600px",
                marginBottom: "16px",
              }}
            >
              <Box
                component="input"
                type="text"
                placeholder="Search by Name or Role"
                value={search}
                onChange={(e) =>
                  setSearchParams({
                    search: e.target.value,
                    filter_by: filterBy,
                    page: 1,
                  })
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                sx={{
                  width: "100%",
                  padding: "12px 16px 12px 48px",
                  fontSize: "14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  outline: "none",
                  backgroundColor: "white",
                  "&:focus": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                  "&::placeholder": {
                    color: "#9ca3af",
                  },
                }}
              />
              <SearchIcon
                sx={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  fontSize: "20px",
                }}
              />
              {search && (
                <IconButton
                  onClick={handleReset}
                  sx={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "4px",
                    color: "#9ca3af",
                    "&:hover": {
                      color: "#6b7280",
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  <ClearIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              )}
            </Box>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Select
                value={filterBy}
                onChange={(e) =>
                  setSearchParams({
                    search,
                    filter_by: e.target.value,
                    page: 1,
                  })
                }
                displayEmpty
                IconComponent={ArrowDropDownIcon}
                sx={{
                  minWidth: "160px",
                  height: "40px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="role">Role</MenuItem>
              </Select>

              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  height: "40px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  paddingX: "20px",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                    boxShadow: "none",
                  },
                }}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  height: "40px",
                  borderColor: "#e5e7eb",
                  color: "#6b7280",
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  paddingX: "20px",
                  "&:hover": {
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          {/* ADD BUTTON – ADMIN ONLY */}
          {isAdmin && (
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                height: "40px",
                backgroundColor: "#10b981",
                color: "white",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                borderRadius: "8px",
                paddingX: "20px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#059669",
                  boxShadow: "none",
                },
              }}
            >
              + Add Employee
            </Button>
          )}
        </Box>

        {/* TABLE */}
        <EmployeeTable
          employees={sortedEmployees}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
        />

        {/* PAGINATION */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={(e, value) =>
              setSearchParams({ search, filter_by: filterBy, page: value })
            }
          />
        </Box>
      </Box>

      {/* ADD EMPLOYEE DIALOG – ADMIN ONLY */}
      {isAdmin && (
  <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: "16px",
      },
    }}
  >
    <DialogTitle
      sx={{
        fontSize: "22px",
        fontWeight: 700,
        padding: "24px 32px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      Add New Employee
    </DialogTitle>

    <form onSubmit={handleAddEmployee}>
      <DialogContent sx={{ padding: "32px" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            onChange={handleFormChange}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            onChange={handleFormChange}
          />

          <TextField
            label="Role"
            name="role"
            fullWidth
            onChange={handleFormChange}
          />

          <TextField
            label="User Role"
            name="userrole"
            select
            fullWidth
            onChange={handleFormChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </TextField>

          <TextField
            label="Date Joined"
            name="date_joined"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleFormChange}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          padding: "24px 32px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button type="submit" variant="contained">
          Add Employee
        </Button>
      </DialogActions>
    </form>
  </Dialog>
)}

    </Box>
  );
}

export default Dashboard;
