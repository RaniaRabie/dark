/*
- File Name: Profile.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
- Contributors: 
- Last Modified Date: 
- Description : 
*/
import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = {
    name: "Username",
    email: "john.doe@example.com",
    bio: "A passionate developer.",
    avatarUrl: "https://via.placeholder.com/150", // Replace with actual URL
  };
  const navigate = useNavigate(); // Initialize navigate function
  const handleEditProfile = () => {
    navigate("/setting");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#f4f6f8",
        borderRadius: 2,
        boxShadow: 3,
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        mt: 10,
      }}
    >
      <Avatar
        alt={user.name}
        src={user.avatarUrl}
        sx={{ width: 100, height: 100, marginBottom: 2 }}
      />
      <Box sx={{ color: "#293241", ml: 3 }}>
        <Typography variant="h4" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {user.email}
        </Typography>
        <Typography variant="body1" align="center" sx={{ marginBottom: 2 }}>
          {user.bio}
        </Typography>
      </Box>
      <Button
        variant="contained"
        type="submit"
        sx={{
          borderRadius: "8px",
          width: "300px",
          bgcolor: "#ee6c4d",
          "&:hover": {
            bgcolor: "#ee6c4d", // Set hover color to match the normal color
            boxShadow: "none", // Remove shadow on hover
          },
        }}
        onClick={handleEditProfile}
      >
        Edit Profile{" "}
      </Button>
    </Box>
  );
};

export default Profile;
