import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

function EmployeeTable({ employees, sortConfig = { key: null, direction: "asc" }, onSortChange = () => {} }) {
  if (!Array.isArray(employees)) {
    return null;
  }

  // Generate avatar initials
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "#f97316", // orange
      "#3b82f6", // blue
      "#10b981", // green
      "#8b5cf6", // purple
      "#ec4899", // pink
      "#f59e0b", // amber
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <UnfoldMoreIcon sx={{ fontSize: "16px", color: "#9ca3af" }} />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpwardIcon sx={{ fontSize: "16px", color: "#3b82f6" }} />
    ) : (
      <ArrowDownwardIcon sx={{ fontSize: "16px", color: "#3b82f6" }} />
    );
  };

  // Sortable header cell
  const SortableHeaderCell = ({ children, columnKey, onClick }) => (
    <TableCell
      sx={{
        cursor: "pointer",
        userSelect: "none",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        "&:hover": {
          backgroundColor: "#f3f4f6",
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 600,
          fontSize: "14px",
          color: "#374151",
        }}
      >
        {children}
        <SortIcon columnKey={columnKey} />
      </Box>
    </TableCell>
  );

  return (
    <TableContainer
      sx={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="employee table">
        <TableHead>
          <TableRow>
            <SortableHeaderCell
              columnKey="id"
              onClick={() => onSortChange("id")}
            >
              User ID
            </SortableHeaderCell>
            <SortableHeaderCell
              columnKey="name"
              onClick={() => onSortChange("name")}
            >
              Full Name
            </SortableHeaderCell>
            <SortableHeaderCell
              columnKey="email"
              onClick={() => onSortChange("email")}
            >
              Email
            </SortableHeaderCell>
            <SortableHeaderCell
              columnKey="role"
              onClick={() => onSortChange("role")}
            >
              Role(s)
            </SortableHeaderCell>
            <SortableHeaderCell
              columnKey="user_role"
              onClick={() => onSortChange("user_role")}
            >
              User Role
            </SortableHeaderCell>
            <SortableHeaderCell
              columnKey="date_joined"
              onClick={() => onSortChange("date_joined")}
            >
              Date Joined
            </SortableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ padding: "40px" }}>
                <Typography sx={{ color: "#6b7280", fontSize: "14px" }}>
                  No employees found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((emp) => (
              <TableRow
                key={emp.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <TableCell sx={{ padding: "16px", color: "#6b7280", fontSize: "14px" }}>
                  {emp.id || "N/A"}
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Avatar
                      sx={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: getAvatarColor(emp.name),
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(emp.name)}
                    </Avatar>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#111827",
                          marginBottom: "2px",
                        }}
                      >
                        {emp.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        @{emp.name?.toLowerCase().replace(/\s+/g, "") || "user"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: "2px",
                      }}
                    >
                      {emp.email}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      No phone
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      backgroundColor: "#eff6ff",
                      color: "#1e40af",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {emp.role || "N/A"}
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "16px" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      backgroundColor: emp.user_role === "Admin" ? "#fef3c7" : "#dbeafe",
                      color: emp.user_role === "Admin" ? "#92400e" : "#1e40af",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {emp.userrole || "N/A"}
                  </Box>
                </TableCell>
                <TableCell sx={{ padding: "16px", color: "#6b7280", fontSize: "14px" }}>
                  {emp.date_joined
                    ? new Date(emp.date_joined).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmployeeTable;
