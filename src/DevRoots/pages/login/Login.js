/*
- File Name: Login.js
- Author: Shrouk Ahmed
- Date of Creation: 20/11/2024
- Versions Information: 1.1.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom,
  }
- Contributors: shrouk ahmed, Nour Khaled, rania rabie
- Last Modified Date: 10/12/2024
- Description : login form
*/
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  // Email Validation
  const [signInEmail, setSignInEmail] = useState("");

  /////////////////////////////////////////////////

  //Password
  const [signInPassword, setSignInPassword] = useState(""); // Password for sign-in
  const [showPassword, setShowPassword] = useState(false);

  /////////////////////////////////////////////////
  //Token , RefreshToken
  axios.interceptors.request.use((request) => {
    console.log("Starting Request", JSON.stringify(request.data, null, 2));
    return request;
  });
  const navigate = useNavigate();
  // Function to handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(""); // Clear the error message after closing
  };

  // login api with token and refresh token
  const { register, handleSubmit } = useForm(); // Assuming you're using react-hook-form

  const onSubmit2 = async (data) => {
    const LoginData = {
      EmailOrUsername: data.signInEmail,
      password: data.password,
    };

    console.log("LoginData being sent:", LoginData);

    try {
      const response = await axios.post(
        "https://careerguidance.runasp.net/Auth/Login",
        LoginData,
        { headers: { "Content-Type": "application/json" } }
      );

      const { role, accessToken, refreshToken, ...otherData } = response.data;

      // Navigate based on role
      if (role === "admin" || role === "Admin") {
        navigate("/dashboard"); // Navigate to admin dashboard
      } else if (role === "Student") {
        navigate("/"); // Navigate to user dashboard
      } else {
        navigate("/"); // Default navigation if role does not match
      }

      // Store user data and tokens in localStorage
      localStorage.setItem("user", JSON.stringify({ role, ...otherData }));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Login successful:", response.data);
      window.location.reload();
    } catch (error) {
      console.log("Error during API call:", error);

      // Handle specific error codes for better feedback
      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 409) ||
        (error.response && error.response.status === 401)
      ) {
        const errorMessage =
          error.response.data.errors[1] || "Invalid Email or Password."; // Show the specific error message from API
        setErrorMessage(errorMessage); // Set the error message
      } else {
        setErrorMessage("An unexpected error occurred.");
      }

      setOpenSnackbar(true); // Show the Snackbar
    }
  };

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };

  const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
  };
  const fetchData = async () => {
    const token = getToken();

    try {
      const response = await axios.get("https://yourapi.com/endpoint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);

      //  handle token expiration and refresh
      if (error.response && error.response.status === 401) {
        console.log("Token expired, refreshing...");
        await refreshAccessToken(); // Implement refresh logic
      }
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    try {
      const response = await axios.post(
        "https://careerguidance.runasp.net/Auth/RefreshToken",
        {
          refreshToken: refreshToken,
        }
      );

      // Store the new access token
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log(
        "Access token refreshed successfully:",
        response.data.accessToken
      );
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
  };
  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  const theme = useTheme();

  ///////////////////////////////////

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        px: 4,
        
      }}
    >
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: "35px",
            fontWeight: "bold",
            textShadow: "1px 1px 1px #b5adad",
          }}
        >
          Sign In{" "}
        </Typography>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* Username or email field */}
          <TextField
            {...register("signInEmail", { required: true })}
            placeholder="Username or email"
            type="text"
            className="signInUser"
            onChange={(e) => setSignInEmail(e.target.value)}
            required
            autoComplete="off"
            sx={{
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 10px transparent inset", // Make the autofill background transparent
                backgroundColor: "transparent",
                WebkitTextFillColor: "#293241", // Maintain your desired text color
                transition: "background-color 5000s ease-in-out 0s", // A trick to override autofill background
              },
              "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover":
                {
                  backgroundColor: "transparent",
                  WebkitBoxShadow: "0 0 0 10px transparent inset", // Keep it transparent on focus/hover
                  transition: "background-color 5000s ease-in-out 0s", // Maintain the background color override
                },

              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                width: "320px",
                height: "37px",
                margin: "15px 0",
                border: "1px solid gray",
                "& fieldset": {
                  border: "none", // Remove the default border
                },
              },
              "& .MuiInputBase-root": {
                "&.Mui-focused": {
                  borderColor: "gray", // Remove focus color
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #ee6c4d",
                      borderLeft: "none",
                      borderTop: "none",
                      borderBottom: "none",
                      borderRadius: "10px 0 0 10px",
                    }}
                  >
                    <PersonIcon
                      style={{
                        color: "#ee6c4d",
                        fontSize: 30,
                        marginRight: 5,
                      }}
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
          {/* Sign in Password field */}
          <TextField
            {...register("password", { required: true })}
            placeholder="Password"
            className="signInPass"
            type={showPassword ? "text" : "password"}
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
            required
            autoComplete="off"
            sx={{
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 10px transparent inset", // Make the autofill background transparent
                backgroundColor: "transparent",
                WebkitTextFillColor: "#293241", // Maintain your desired text color
                transition: "background-color 5000s ease-in-out 0s", // A trick to override autofill background
              },
              "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover":
                {
                  backgroundColor: "transparent",
                  WebkitBoxShadow: "0 0 0 10px transparent inset", // Keep it transparent on focus/hover
                  transition: "background-color 5000s ease-in-out 0s", // Maintain the background color override
                },

              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                width: "320px",
                height: "37px",
                border: "1px solid gray",
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-root": {
                "&.Mui-focused": { borderColor: "gray" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #ee6c4d",
                      borderLeft: "none",
                      borderTop: "none",
                      borderBottom: "none",
                      borderRadius: "10px 0 0 10px",
                    }}
                  >
                    <LockIcon
                      style={{
                        color: "#ee6c4d",
                        fontSize: 30,
                        marginRight: 5,
                      }}
                    />
                  </div>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleShowPassword}
                    edge="end"
                    style={{ color: "gray" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Remember me and forgot password */}
          <Box
            className="CheckBox"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Adjust spacing between checkbox and link
              width: "90%", // Adjust width as per the layout
            }}
          >
            {/* Remember Me Checkbox */}
            <Box display="flex" alignItems="center" mt={1}>
              {" "}
              {/* Aligns the checkbox and label */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      transform: "scale(0.8)", // Adjust checkbox size
                      "&.Mui-checked": {
                        color: "#ee6c4d",
                      },
                    }}
                  />
                }
                label="Remember Me"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "13px", // Set font size for the label
                    color: theme.palette.text.primary, // Set label color
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>

            {/* Forget Your Password Link */}
            <Link
              to="/ForgotPassword" // Replace with your actual route
              style={{
                textDecoration: "none",
                color: theme.palette.text.primary,
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit2)}
            sx={{
              textTransform: "capitalize",
              backgroundColor: "#ee6c4d",
              width: "150px",
              letterSpacing: " 0.5px",
              margin: "10px 0px",
              cursor: " pointer",
              border: "1px solid transparent",
              borderRadius: "8px",
            }}
          >
            Sign In
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{
                width: "100%",
                backgroundColor: "#F5F5DC",
                color: "#ee6c4d",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
