import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

      // ✅ Save JWT
      localStorage.setItem("token", res.data.access_token);

      // ✅ Reload app to trigger auth state
      window.location.reload();

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Employee Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* IMPORTANT: type="submit" */}
          <Button
            type="submit"
            color="secondary"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
