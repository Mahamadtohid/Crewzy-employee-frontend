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
  AdminPanelSettings,
} from "@mui/icons-material";

function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    userrole: "",
    date_joined: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    if (
      !form.name ||
      !form.email ||
      !form.role ||
      !form.userrole ||
      !form.date_joined
    ) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    const employeeData = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      userrole: form.userrole,
      date_joined: form.date_joined, // YYYY-MM-DD
    };

    console.log("SENDING PAYLOAD:", JSON.stringify(employeeData, null, 2));

    try {
      await API.post("/employees", employeeData);

      alert("Employee added successfully");

      setForm({
        name: "",
        email: "",
        role: "",
        userrole: "",
        date_joined: "",
      });

      navigate("/");
    } catch (err) {
      // 🔴 DEBUG BLOCK — THIS IS WHAT YOU ASKED FOR
      console.error("FULL ERROR:", err);

      if (err.response) {
        console.error("STATUS:", err.response.status);
        console.error(
          "DATA:",
          JSON.stringify(err.response.data, null, 2)
        );
      } else {
        console.error("NO RESPONSE:", err.message);
      }

      alert("Check console for detailed error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const userRoles = ["Admin", "Employee"];

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
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              Back to Dashboard
            </Button>

            <Typography
              variant="h4"
              sx={{ fontSize: "28px", fontWeight: 700, color: "#111827" }}
            >
              Add New Employee
            </Typography>

            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Fill in the details to add a new employee
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <TextField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="User Role"
                name="userrole"
                select
                value={form.userrole}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminPanelSettings />
                    </InputAdornment>
                  ),
                }}
              >
                {userRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date Joined"
                name="date_joined"
                type="date"
                value={form.date_joined}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: "12px" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ backgroundColor: "#10b981" }}
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
