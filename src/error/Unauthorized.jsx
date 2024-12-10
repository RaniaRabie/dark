
/*
- File Name: Unauthorized.jsx
- Author: Rania Rabie
- Date of Creation: 20/11/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  react-router-dom,
  assests
  }
- Contributors: shrouk ahmed, Nour Khaled, rania rabie
- Last Modified Date: 10/12/2024
- Description : page for Unauthorized users access
*/
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import error from "../../src/assests/error.svg";

const Unauthorized = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const handleBackToHomeClick = () => {
    navigate("/")
  }
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: `calc(100vh - 64px)`,
        color: theme.palette.text.primary, // White text
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Error img */}
      <img
              src={error}
              alt="error"
              style={{width:"145px" }}
            />

      {/* Error Title */}
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "16px"}}>
        401: Authorization required
      </Typography>

      {/* Error Message */}
      <Typography
        variant="body1"
        sx={{
          color:"gray", // Gray text for subtitle
          maxWidth: "600px",
          marginBottom: "24px",
        }}
      >
        You either tried some shady route or you came here by mistake. Whichever
        it is, try using the navigation.
      </Typography>

      {/* Back to Home Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#ee6c4d",
          color: "#ffffff",
          fontWeight: "bold",
          textTransform: "none",
          padding: "10px 20px",
          
        }}
        onClick={handleBackToHomeClick} // Navigate back to the homepage
      >
        Back to home
      </Button>
    </Box>
  );
};

export default Unauthorized;
