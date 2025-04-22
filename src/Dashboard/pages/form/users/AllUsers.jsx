import { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AllUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 9 };
// Function to refresh access token using refresh token
const refreshAccessToken = async () => {
  const storedRefresh = localStorage.getItem("refreshToken");
  if (!storedRefresh) throw new Error("No refresh token found");

  const response = await axios.post(
    "https://careerguidance.runasp.net/Auth/refresh",
    { refreshToken: storedRefresh }
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);
  return accessToken;
};

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    const getUsers = async (token) => {
      return axios.get(
        "https://careerguidance.runasp.net/api/Dashboard/GetAllUsers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
    };

    try {
      let token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");

      let response;
      try {
        response = await getUsers(token);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Try refreshing token once
          token = await refreshAccessToken();
          response = await getUsers(token);
        } else {
          throw err;
        }
      }

      const formattedData = response.data.map((user) => ({
        id: user.id,
        name: user.userName,
        email: user.email,
        role: user.role || "N/A",
      }));

      setRows(formattedData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);
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
