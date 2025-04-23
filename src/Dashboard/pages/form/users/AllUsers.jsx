import { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

export default function AllUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 9 };
  const {token} = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) throw new Error("No access token found");

        // Use apiClient for the API call, which handles token refresh
        const response = await axios.get(
          "https://careerguidance.runasp.net/api/Dashboard/GetAllUsers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Format the response data
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
  }, [token]); // Add token as a dependency to re-fetch if token changes

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
          // @ts-ignore
          slots={{ toolbar: GridToolbarQuickFilter }}
          rows={rows}
          // @ts-ignore
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          sx={{
            border: 0,
            "& .MuiDataGrid-row:hover": { cursor: "pointer" },
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
