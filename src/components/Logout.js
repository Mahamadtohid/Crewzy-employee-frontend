import Button from "@mui/material/Button";

function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
