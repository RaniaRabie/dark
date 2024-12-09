/*
- File Name: Setting.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,s
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : 
*/
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
  useTheme
} from "@mui/material";

const EditProfile = () => {
  const theme = useTheme(); // للحصول على الثيم الحالي
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "A passionate developer.",
    avatarUrl: "https://via.placeholder.com/150"
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", user);
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: theme.palette.mode === "dark" ? "#262626" : "#f4f6f8",        
        color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
        borderRadius: 2,
        boxShadow: 3,
        width: "100%",
        maxWidth: 600,
        margin: "auto"
      }}
    >
      <Avatar
        alt={user.name}
        src={user.avatarUrl}
        sx={{ width: 100, height: 100, marginBottom: 2 }}
      />
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "inherit", // لون الخلفية في الوضع الداكن فقط
            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit"
          }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "inherit",
            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit"
          }}
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={user.bio}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={4}
          variant="outlined"
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "inherit",
            color: theme.palette.mode === "dark" ? "#ffffff" : "inherit"
          }}
        />
      </form>

      {/* Save Button */}
      <Button
        variant="contained"
        type="button"
        onClick={handleSubmit}
        sx={{
          borderRadius: "8px",
          width: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.mode === "dark" ? "#ee6c4d" : "#ee6c4d",
          color: theme.palette.mode === "dark" ? "#ffffff" : theme.palette.primary.contrastText,
          "&:hover": {
            bgcolor: theme.palette.mode === "dark" ? "#d45a3a" : "#ee6c4d",
          }
        }}
      >
        Save
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
