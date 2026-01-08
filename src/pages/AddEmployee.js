import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import {
  Person,
  Email,
  Work,
  CalendarToday,
  ArrowBack,
} from "@mui/icons-material";

function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    // Validate form data
    if (!form.name || !form.email || !form.role || !form.date_joined) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    console.log("Submitting form data:", form);

    try {
      const response = await API.post("/employees", form);
      console.log("Employee added successfully:", response.data);
      alert("Employee added successfully");
      
      setForm({
        name: "",
        email: "",
        role: "",
        date_joined: "",
      });
      navigate("/");
    } catch (err) {
      console.error("Error adding employee:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.detail || 
        err.message || 
        "Failed to add employee. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    const formElement = e.target.closest("form");
    if (formElement) {
      formElement.requestSubmit();
    } else {
      handleSubmit(e);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const roles = ["employee", "admin", "librarian", "manager"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "16px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent sx={{ padding: "40px" }}>
          {/* Header */}
          <Box sx={{ marginBottom: "32px" }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              sx={{
                color: "#6b7280",
                textTransform: "none",
                fontSize: "14px",
                marginBottom: "16px",
                padding: "4px 8px",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              Back to Dashboard
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "8px",
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Full Name Field */}
              <TextField
                label="Full Name"
                name="name"
                placeholder="Enter full name"
                variant="outlined"
                fullWidth
                value={form.name}
                onChange={handleChange}
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
                onChange={handleChange}
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

              {/* Role Field */}
              <TextField
                label="Role"
                name="role"
                select
                variant="outlined"
                fullWidth
                value={form.role}
                onChange={handleChange}
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
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
                onChange={handleChange}
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

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    height: "44px",
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 500,
                    borderRadius: "8px",
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
                  fullWidth
                  disabled={loading}
                  onClick={handleButtonClick}
                  sx={{
                    height: "44px",
                    backgroundColor: "#10b981",
                    color: "white",
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    borderRadius: "8px",
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
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddEmployee;