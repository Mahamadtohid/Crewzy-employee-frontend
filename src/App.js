import DashBoard from "./pages/DashBoard";
import AddEmployee from "./pages/AddEmployee";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");

  if (!token) return <Login />

  return (
    <div>
      <DashBoard />
      <AddEmployee />
    </div>
  );
}

export default App;
