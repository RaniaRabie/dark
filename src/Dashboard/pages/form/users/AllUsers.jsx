/*
- File Name: AllUsers.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled , mohamed khaled
- Last Modified Date: 1/11/2024
- Description : table of all users 
*/
import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid/components";
import { DataGrid} from "@mui/x-data-grid";
import GroupIcon from "@mui/icons-material/Group";

const paginationModel = { page: 0, pageSize: 9 };

export default function Contacts() {
  const [rows, setRows] = useState([]); // Use state to store rows data

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch("https://careerguidance.runasp.net/api/Dashboard/GetAllUsers")
      .then((response) => response.json())
      .then((data) => {
        // Map API response to match DataGrid row format
        const formattedData = data.map((user, index) => ({
          id: index + 1,
          name: user.userName,
          email: user.email,
          role: user.role || "N/A", // Handle if role is empty
        }));
        setRows(formattedData); // Update rows with fetched data
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []); // Empty dependency array ensures this runs once on mount

  const columns = [
    {
      field: "name",
      headerName: "Username",
      width: 210,
      // cellClassName: "name-column--cell",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      headerAlign: "center",
      align: "center"
    },
  ];

  return (
    <>
        <Box textAlign={"center"}>
          <Typography sx={{fontSize:"25px", fontWeight:"bold"}}>
            <GroupIcon /> Users
          </Typography>
        </Box>
        
        <Paper sx={{ height: "85vh", width: {xs:"90%", md:"80%"} , m:"auto"}}>
          <DataGrid
            // @ts-ignore
            slots={{ toolbar: GridToolbarQuickFilter }}
            rows={rows}
            // @ts-ignore
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
            disableSelectionOnClick
          />
        </Paper>
    </>
  );
}
