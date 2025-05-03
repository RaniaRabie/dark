import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../services/axiosInstance";

export default function AllUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 9 };
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/api/Dashboard/GetAllUsers", {});

        const formattedData = response.data.map((user) => ({
          id: user.id,
          name: user.userName,
          email: user.email,
          role: user.role || "N/A",
        }));

        setRows(formattedData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRowClick = (params) => {
    navigate(`/dashboard/profile/${params.row.id}`, { state: params.row });
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 25, fontWeight: "bold" }}>
          <GroupIcon /> Users
        </Typography>
      </Box>

      <Paper
        sx={{
          height: "85vh",
          width: { xs: "90%", md: "80%" },
          m: "auto",
          boxShadow: 3,
        }}
      >
        <DataGrid
          slots={{ toolbar: GridToolbarQuickFilter }}
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          sx={{
            border: 0,
            "& .MuiDataGrid-row:hover": { cursor: "pointer" },
            "& .MuiCheckbox-root": {
              color: theme.palette.text.primary, // unselected border color
            },
            "& .Mui-checked": {
              color: "#ee6c4d", // your preferred checked color
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
          getRowId={(row) => row.id}
        />
      </Paper>
    </>
  );
}

const columns = [
  {
    field: "name",
    headerName: "Username",
    width: 210,
    headerAlign: "center",
  },
  { field: "email", headerName: "Email", width: 220, headerAlign: "center" },
  {
    field: "role",
    headerName: "Role",
    width: 120,
    headerAlign: "center",
    align: "center",
  },
];
