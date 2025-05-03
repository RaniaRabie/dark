import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  List,
  IconButton,
  Stack,
  Tooltip,
  ListItem,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { api, scheduleTokenRefresh } from "services/axiosInstance";
import { setAccessToken, setRefreshToken } from "../../../services/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [focused, setFocused] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Validation logic
  const isValidUsername = /^[a-zA-Z]{3,}[0-9]{2,}$/.test(username);
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0;
  

  const usernameCriteria = [
    { label: 'Must start with at least 3 letters followed by at least 2 numbers', valid: isValidUsername },
  ];


  const emailCriteria = [
    { label: 'Must be a valid email address', valid: emailError },
  ];

  // Password Validation
  const validations = {
    minLength: signUpPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(signUpPassword),
    hasLowerCase: /[a-z]/.test(signUpPassword),
    hasNumber: /[0-9]/.test(signUpPassword),
    hasSpecialChar: /[!@#$%^&*]/.test(signUpPassword),
    match: signUpPassword && confirmPassword ? confirmPassword === signUpPassword : false,
  };

  const validationCriteria = [
    { label: "At least 8 characters", valid: validations.minLength },
    { label: "At least one uppercase letter", valid: validations.hasUpperCase },
    { label: "At least one lowercase letter", valid: validations.hasLowerCase },
    { label: "At least one number", valid: validations.hasNumber },
    { label: "At least one special character", valid: validations.hasSpecialChar },
  ];

  const ConfirmValidationCriteria = [
    { label: "Passwords match", valid: validations.match },
  ];

  const allCriteriaMet = validationCriteria.every((item) => item.valid);

  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Form Submission
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const isUsernameValid = isValidUsername;
    const isEmailValid = emailError;
    const isPasswordValid = allCriteriaMet;
    const isConfirmPasswordValid = confirmPassword === signUpPassword;

    if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      onSubmit({
        username: username.trim(),
        password: signUpPassword.trim(),
        email: email.trim(),
        confirmPassword: confirmPassword.trim(),
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/Auth/SignUp", data);
      const { role, token: accessToken, refreshToken, expiresIn, ...otherData } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      login({ role, ...otherData });
      scheduleTokenRefresh(expiresIn);

      console.log("Sign-up successful:", response.data);
      setOpen(true);
      navigate("/");
    } catch (error) {
      console.log("Error during API call:", error);
      if (error.response && [400, 409, 401].includes(error.response.status)) {
        const errorMessage =
          error.response.data.errors?.[1] ||
          error.response.data.errors?.[0] ||
          "Invalid signup data.";
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setOpenSnackbar(true);
    }
  };

  // Handlers
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleSuccess = async (response) => {
    const credentialResponseDecoded = jwtDecode(response.credential);
    try {
      const apiResponse = await api.post("/Auth/Google-Signin", { token: response.credential });
      const { role, token: accessToken, refreshToken, expiresIn, ...otherData } = apiResponse.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      login({ role, ...otherData });
      scheduleTokenRefresh(expiresIn);

      navigate("/");
      console.log("Google Sign-In successful:", apiResponse.data);
    } catch (error) {
      console.error("API Call Failed:", error);
    }
  };

  const handleFailure = (error) => {
    console.error("Login Failed:", error);
  };

  // Mobile Detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <Box style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Typography
          fontWeight="bold"
          mb={2}
          sx={{
            color: theme.palette.text.primary,
            fontSize: "30px",
            fontWeight: "bold",
            textShadow: "1px 1px 1px #b5adad",
          }}
        >
          Create Account
        </Typography>

        {/* Username Field */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Tooltip
          title={
            <Box sx={{ width: 230 }}>
              <Typography variant="h6" sx={{ fontSize: 13, fontWeight: 'bold', color: '#293241' }}>
                Username Requirements:
              </Typography>
              <List>
                {usernameCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? 'green' : 'red'}
                      sx={{ display: 'flex', alignItems: 'center', fontSize: '10px', margin: 0, padding: 0 }}
                    >
                      {item.valid ? '✔' : '✖'} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={focused.username || (submitted && !isValidUsername)}
          placement={isMobile ? 'bottom' : 'right-start'}
          arrow
          PopperProps={{
            sx: { '& .MuiTooltip-tooltip': { backgroundColor: '#f5f5f5', color: '#293241' } },
            modifiers: [{ name: 'offset', options: { offset: isMobile ? [0, 8] : [8, -5] } }],
          }}
        >
            <TextField
              placeholder="Username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              error={!isValidUsername}
              autoComplete="off"
              onFocus={() => setFocused((prev) => ({ ...prev, username: true }))}
              onBlur={() => setFocused((prev) => ({ ...prev, username: false }))}
              sx={{
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 10px transparent inset",
                  backgroundColor: "transparent",
                  WebkitTextFillColor: "#293241",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
                  backgroundColor: "transparent",
                  WebkitBoxShadow: "0 0 0 10px transparent inset",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  width: "320px",
                  height: "37px",
                  margin: "0",
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
                      <PersonIcon style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }} />
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </Tooltip>
        </Box>

        {/* Email Field */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Tooltip
          title={
            <Box sx={{ width: 230 }}>
              <Typography variant="h6" sx={{ fontSize: 13, fontWeight: 'bold', color: '#293241' }}>
                Email Requirements:
              </Typography>
              <List>
                {emailCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? 'green' : 'red'}
                      sx={{ display: 'flex', alignItems: 'center', fontSize: '10px', margin: 0, padding: 0 }}
                    >
                      {item.valid ? '✔' : '✖'} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={focused.email || (submitted && !emailError)}
          placement={isMobile ? 'bottom' : 'right-start'}
          arrow
          PopperProps={{
            sx: { '& .MuiTooltip-tooltip': { backgroundColor: '#f5f5f5', color: '#293241' } },
            modifiers: [{ name: 'offset', options: { offset: isMobile ? [0, 8] : [8, -5] } }],
          }}
        >
            <TextField
              placeholder="Email"
              type="email"
              error={!emailError}
              value={email}
              autoComplete="off"
              onChange={handleEmailChange}
              onFocus={() => setFocused((prev) => ({ ...prev, email: true }))}
              onBlur={() => setFocused((prev) => ({ ...prev, email: false }))}
              sx={{
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 10px transparent inset",
                  backgroundColor: "transparent",
                  WebkitTextFillColor: "#293241",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
                  backgroundColor: "transparent",
                  WebkitBoxShadow: "0 0 0 10px transparent inset",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  width: "320px",
                  height: "37px",
                  margin: "10px 0",
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
                      <EmailIcon style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }} />
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </Tooltip>
        </Box>

        {/* Password Field */}
        <Tooltip
          title={
            <Box sx={{ width: 230 }}>
              <Typography variant="h6" sx={{ fontSize: 13, fontWeight: "bold", color: "#293241" }}>
                Password Requirements:
              </Typography>
              <List>
                {validationCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? "green" : "red"}
                      sx={{ display: "flex", alignItems: "center", fontSize: "10px", margin: 0, padding: 0 }}
                    >
                      {item.valid ? "✔" : "✖"} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={focused.password || (submitted && !allCriteriaMet)}
          placement={isMobile ? "bottom" : "right-start"}
          
          arrow
          PopperProps={{
            sx: {
              "& .MuiTooltip-tooltip": { backgroundColor: "#f5f5f5", color: "#293241" },
            },
            modifiers: [{ name: "offset", options: { offset: isMobile ? [0, -12] : [10, -5] } }],
          }}
        >
          <TextField
            placeholder="Password"
            type="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
            onFocus={() => setFocused((prev) => ({ ...prev, password: true }))}
            onBlur={() => setFocused((prev) => ({ ...prev, password: false }))}
            sx={{
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 10px transparent inset",
                backgroundColor: "transparent",
                WebkitTextFillColor: "#293241",
                transition: "background-color 5000s ease-in-out 0s",
              },
              "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
                backgroundColor: "transparent",
                WebkitBoxShadow: "0 0 0 10px transparent inset",
                transition: "background-color 5000s ease-in-out 0s",
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
                    <LockIcon style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }} />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>

        {/* Confirm Password Field */}
        <Tooltip
          title={
            <Box sx={{ width: 230 }}>
              
              <List>
                {ConfirmValidationCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? "green" : "red"}
                      sx={{ display: "flex", alignItems: "center", fontSize: "10px", margin: 0, padding: 0 }}
                    >
                      {item.valid ? "✔" : "✖"} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={focused.confirmPassword || (submitted && !validations.match)}
          placement={isMobile ? "bottom" : "right-start"}
          arrow
          PopperProps={{
            sx: {
              "& .MuiTooltip-tooltip": { backgroundColor: "#f5f5f5", color: "#293241" },
            },
            modifiers: [{ name: "offset", options: { offset: isMobile ? [0, -20] : [9, -5] } }],
          }}
        >
          <TextField
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocused((prev) => ({ ...prev, confirmPassword: true }))}
            onBlur={() => setFocused((prev) => ({ ...prev, confirmPassword: false }))}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                width: "320px",
                height: "37px",
                margin: "10px 0",
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
                    <EnhancedEncryptionIcon style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }} />
                  </div>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleShowPassword} edge="end" style={{ color: "gray" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>

        <Button
          type="submit"
          variant="contained"
          onClick={handleSignUpSubmit}
          sx={{
            textTransform: "capitalize",
            backgroundColor: "#ee6c4d",
            width: "150px",
            letterSpacing: "0.5px",
            margin: "10px 0px",
            cursor: "pointer",
            border: "1px solid transparent",
            borderRadius: "8px",
          }}
        >
          Sign Up
        </Button>

        {/* Google Login */}
        <Stack display="flex" alignItems="center" justifyContent="center" direction="row" sx={{ mb: 1 }}>
          <div style={{ border: "1px solid rgba(34, 60, 84, 0.397)", width: 150, margin: 10 }}></div>
          <span style={{ color: theme.palette.text.primary, fontWeight: "bold" }}> OR </span>
          <div style={{ border: "1px solid rgba(4, 60, 84, 0.397)", width: 150, margin: 10 }}></div>
        </Stack>
        <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
      </Box>

      {/* Snackbars */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info" variant="filled" sx={{ width: "100%" }}>
          Account created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;