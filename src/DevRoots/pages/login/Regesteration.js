import React, { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Login from "./Login";
import Signup from "./SignUp";

const Regesteration = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false); // To manage flip state on smaller screens

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
        backgroundColor: theme.palette.background.default, // Dynamic background color
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "400px", md: "990px" },
          height: { xs: "500px", sm: "500px", md: "520px" },
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.35)",
          perspective: "1000px", // Perspective for flip animation
          backgroundColor:"red",
        }}
      >
        {/* Card Flip Container for Smaller Screens */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s ease-in-out",
            display: { xs: "block", md: "none" },
          }}
        >
          {/* Front Face (Login) */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Login />
            <Typography
              sx={{
                fontSize: "13px",
                mt: 2,
                color: theme.palette.text.secondary, // Dynamic text color
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <Box
                component="span"
                sx={{
                  color: theme.palette.primary.main, // Dynamic primary color
                  textTransform: "capitalize",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setIsFlipped(true)}
              >
                Sign Up
              </Box>
            </Typography>
          </Box>

          {/* Back Face (Signup) */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: theme.palette.background.paper, // Dynamic paper background
            }}
          >
            <Signup />
            <Typography
              sx={{
                fontSize: "13px",
                mt: 2,
                bgcolor: theme.palette.background.paper, // Dynamic paper background
                textAlign: "center",
              }}
            >
              Already have an account?{" "}
              <Box
                component={"span"}
                sx={{
                  color: theme.palette.primary.main, // Dynamic primary color
                  textTransform: "capitalize",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setIsFlipped(false)}
              >
                Sign in
              </Box>
            </Typography>
          </Box>

          
        </Box>

        {/* Full View for Larger Screens */}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: { xs: "none", md: "flex" },
          }}
        >
          {/* Left Panel */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: isLogin ? 0 : "50%",
              width: "50%",
              height: "100%",
              bgcolor: "#ee6c4d",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.text.primary, // Dynamic text color
              zIndex: 2,
              transition: "all 0.6s ease-in-out",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ textShadow: "1px 3px 3px rgba(0, 0, 0, 0.2)" }}
            >
              {isLogin ? "Join Us Today!" : "Welcome Back!"}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "400",
                letterSpacing: "0.4px",
                lineHeight: "1.6",
              }}
            >
              {isLogin
                ? "Already have an account? Log in with your credentials."
                : "Don't have an account? Register with your personal information."}
            </Typography>
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#ee6c4d",
                width: "150px",
                letterSpacing: " 0.5px",
                margin: "10px 0px",
                cursor: "pointer",
                border: "1px solid white",
                borderRadius: "8px",
                mt: "50px",
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </Box>

          {/* Forms Container */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              transition: "transform 0.6s ease-in-out",
            }}
          >
            {/* Login Form */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.background.paper, // Dynamic paper background
                color: theme.palette.text.primary,
              }}
            >
              <Login />
            </Box>

            {/* Sign Up Form */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.background.paper, // Dynamic paper background
                color: theme.palette.text.primary,
              }}
            >
              <Signup />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Regesteration;
