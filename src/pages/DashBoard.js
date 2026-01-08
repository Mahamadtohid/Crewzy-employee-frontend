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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    userrole: "",
    date_joined: "",
  });

  const userRoles = ["Admin", "User"];

  // Read from URL
  const search = searchParams.get("search") || "";
  const filterBy = searchParams.get("filter_by") || "all";
  const page = Number(searchParams.get("page")) || 1;

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchEmployees = async () => {
    try {
      const currentSearch = searchParams.get("search") || "";
      const currentFilterBy = searchParams.get("filter_by") || "all";
      const currentPage = Number(searchParams.get("page")) || 1;

      const res = await API.get(
        `/employees?search=${currentSearch}&filter_by=${currentFilterBy}&page=${currentPage}&limit=${limit}`
      );

      console.log("API Response:", res.data);

      // Handle different possible response structures
      if (res.data) {
        const employeesData = res.data.data || res.data.employees || res.data || [];
        const totalData = res.data.total || res.data.count || employeesData.length || 0;
        
        setEmployees(Array.isArray(employeesData) ? employeesData : []);
        setTotal(totalData);
      } else {
        setEmployees([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      console.error("Error details:", err.response?.data);
      setEmployees([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterBy, page]);

  const handleSearch = () => {
    setSearchParams({
      search,
      filter_by: filterBy,
      page: 1,
    });
  };

  const handleReset = () => {
    setSearchParams({
      search: "",
      filter_by: "all",
      page: 1,
    });
  };

  const handleSortChange = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Dialog handlers
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setForm({
      name: "",
      email: "",
      role: "",
      userrole: "",
      date_joined: "",
    });
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (!form.name || !form.email || !form.role || !form.date_joined) {
      alert("Please fill in all required fields (Name, Email, Role, Date Joined)");
      setLoading(false);
      return;
    }

    console.log("Submitting form data:", form);
    console.log("Form data structure:", JSON.stringify(form, null, 2));

    try {
      // Prepare data for backend - try with user_role first, fallback if backend doesn't support it
      const employeeData = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        userrole: form.userrole,
        date_joined: form.date_joined,
      };
      
      // Add user_role only if it's provided (backend might not support it yet)
      // if (form.user_role) {
      //   employeeData.user_role = form.user_role;
      // }
      
      console.log("Sending to backend:", employeeData);
      
      const response = await API.post("/employees", employeeData);
      console.log("Employee added:", response.data);
      console.log("Full response:", response);
      alert("Employee added successfully");
      handleCloseDialog();
      // Refresh the employee list
      await fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.detail || 
        err.message || 
        "Failed to add employee. Please check the console for details.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sort employees based on sortConfig
  const sortedEmployees = sortConfig.key
    ? [...employees].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting
        if (sortConfig.key === "date_joined") {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        // Handle string sorting
        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Handle null/undefined values
        if (aValue == null) aValue = "";
        if (bValue == null) bValue = "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      })
    : employees;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "24px",
      }}
    >
      <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
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
                placeholder="Search by Name, Employee ID, Email, Phone Number"
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
        </Box>

        {/* Table */}
        <EmployeeTable
          employees={sortedEmployees}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
        />

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <Pagination
            count={totalPages > 0 ? totalPages : 1}
            page={page}
            onChange={(e, value) =>
              setSearchParams({
                search,
                filter_by: filterBy,
                page: value,
              })
            }
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "6px",
              },
            }}
          />
        </Box>
      </Box>

      {/* Add Employee Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        <DialogTitle
          sx={{
            padding: "24px 24px 16px 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                Add New Employee
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Fill in the details to add a new employee to the system
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                color: "#6b7280",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleAddEmployee}>
          <DialogContent sx={{ padding: "24px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Full Name Field */}
              <TextField
                label="Full Name"
                name="name"
                placeholder="Enter full name"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={handleFormChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#9ca3af", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              />

              {/* Email Field */}
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                variant="outlined"
                fullWidth
                value={form.email}
                onChange={handleFormChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#9ca3af", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              />

              {/* Role Field - Text Input */}
              <TextField
                label="Role"
                name="role"
                placeholder="Enter role (e.g., employee, manager, etc.)"
                variant="outlined"
                fullWidth
                value={form.role}
                onChange={handleFormChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work sx={{ color: "#9ca3af", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              />

              {/* User Role Field - Dropdown */}
              <TextField
                label="User Role"
                name="userrole"
                select
                variant="outlined"
                fullWidth
                value={form.userrole}
                onChange={handleFormChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminPanelSettings sx={{ color: "#9ca3af", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              >
                {userRoles.map((userRole) => (
                  <MenuItem key={userRole} value={userRole}>
                    {userRole}
                  </MenuItem>
                ))}
              </TextField>

              {/* Date Joined Field */}
              <TextField
                label="Date Joined"
                name="date_joined"
                type="date"
                variant="outlined"
                fullWidth
                value={form.date_joined}
                onChange={handleFormChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: "#9ca3af", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              padding: "16px 24px 24px 24px",
              borderTop: "1px solid #e5e7eb",
              gap: "12px",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              disabled={loading}
              sx={{
                height: "44px",
                borderColor: "#e5e7eb",
                color: "#6b7280",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                borderRadius: "8px",
                paddingX: "24px",
                "&:hover": {
                  borderColor: "#d1d5db",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                height: "44px",
                backgroundColor: "#10b981",
                color: "white",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 600,
                borderRadius: "8px",
                paddingX: "24px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#059669",
                  boxShadow: "none",
                },
                "&:disabled": {
                  backgroundColor: "#9ca3af",
                },
              }}
            >
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
