import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import Navigation from "../components/Navigation";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      localStorage.setItem("token", res.data.access_token);
      window.location.reload();
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <Navigation />

      {/* Split-screen layout */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left side - Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              border: "4px solid #fef3c7",
              maxWidth: "448px",
              width: "100%",
            }}
          >
            <img
              src="/loginbg.png"
              alt="Employee Rental Benefits"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "4px",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "448px" }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", marginBottom: "32px" }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: "12px",
                  letterSpacing: "-0.025em",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#4b5563",
                  fontSize: "16px",
                }}
              >
                Please enter your details to log in
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Username Field */}
                <TextField
                  label="Username"
                  placeholder="Enter your username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

                {/* Password Field */}
                <TextField
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#9ca3af", fontSize: "20px" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            color: "#9ca3af",
                            "&:hover": {
                              color: "#3b82f6",
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    fontSize: "16px",
                    fontWeight: 500,
                    borderRadius: "6px",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#2563eb",
                      boxShadow: "none",
                    },
                    "&:active": {
                      backgroundColor: "#1d4ed8",
                    },
                  }}
                >
                  Login
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Login;
