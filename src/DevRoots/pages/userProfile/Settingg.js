
/*
- File Name: Security.js
- Author: Nourhan Khaled
- Date of Creation: 10/3/2025
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT,
  @mui/material,
  @mui/icons-material,
  axiosInstance,
  context/AuthContext
  }
- Contributors:  Rania Rabie , Shrouk Ahmed ,Nourhan Khaled
- Last Modified Date: 2/5/2025
- Description: Component for updating user password with validation and API integration
*/

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Tooltip,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import { useAuth } from "context/AuthContext";
import {api} from "../../../services/axiosInstance"


// Setting component for updating user password
const Setting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <= 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  // State for form inputs, errors, and UI controls
  const [error, setError] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [confirmTooltipOpen, setConfirmTooltipOpen] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const { user } = useAuth();
  const userId = user?.id;

  // Toggle password visibility
  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  // Close snackbar
  const handleCloseSnackbar = () => setOpenSnackbar(false);

  // Handle form submission and password update
  const handleSubmit = async () => {
    // Validate password requirements
    const validations = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      match: password === confirmPassword,
    };

    // Check if new password matches current password
    if (password === currentPassword) {
      setErrorMessage(
        "New password must not be the same as the current password"
      );
      setOpenSnackbar(true);
      return;
    }

    // Check if all validations pass
    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setErrorMessage("Please meet all the password requirements.");
      setOpenSnackbar(true);
      return;
    }


    try {
      // Fetch user data to verify
      const verifyResponse = await api.get(
        `/api/userProfile/GetUserById/${userId}`,

      );

      const userData = verifyResponse.data;

      // Update password via API
      await api.put(
        `/api/userProfile/UpdatePassword/${userId}`,
        {
          ...userData,
          OldPassword: currentPassword,
          NewPassword: password,
          confirmPassword: password,
        },

      );
      setErrorMessage("Password updated successfully");
      setOpenSnackbar(true);
      // Reset form fields
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      // Handle API errors
      let msg = "An unexpected error occurred.";
      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        if (Array.isArray(backendErrors)) {
          msg = backendErrors[0] || msg;
        } else if (typeof backendErrors === "object") {
          const firstKey = Object.keys(backendErrors)[0];
          msg = backendErrors[firstKey]?.[0] || msg;
        }
      }
      setErrorMessage(msg);
      setOpenSnackbar(true);
    }
  };

  // Styles for input fields
  const inputStyleFull = {
    width: { xs: "100%", sm: "90%", md: "85%", lg: "100%" },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.text.primary,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      height: "45px",
      paddingRight: 1,
      backgroundColor: "transparent",
      "& fieldset": { border: "1px solid #ee6c4d" },
      "&:hover fieldset": { borderColor: "#ee6c4d" },
      "&.Mui-focused fieldset": { borderColor: "#ee6c4d" },
    },

    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 10px transparent inset",
      backgroundColor: "transparent",
      WebkitTextFillColor: theme.palette.text.primary,
      transition: "background-color 5000s ease-in-out 0s",
    },
    "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
      backgroundColor: "transparent",
      WebkitBoxShadow: "0 0 0 10px transparent inset",
      transition: "background-color 5000s ease-in-out 0s",
    },
  };

  // Input adornment with custom icons
  const adornmentProps = (icon) => ({
    startAdornment: (
      <InputAdornment position="start">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {React.cloneElement(icon, {
            style: {
              color: "#ee6c4d",
              fontSize: 25,
              ...icon.props?.style,
            },
          })}
          <div
            style={{
              height: "30px",
              width: "2px",
              backgroundColor: "#ee6c4d",
              marginLeft: "8px",
              marginRight: "4px",
              borderRadius: "1px",
            }}
          />
        </div>
      </InputAdornment>
    ),
  });

  // Render the password update form
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "500px", md: "500px" },
        mx: "auto",
        p: { xs: 3, sm: 4 },
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        opacity: 0,
        transform: "translateY(20px)",
        animation: "fadeInUp 0.6s ease-out forwards",
        "@keyframes fadeInUp": {
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* Title with animated underline */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            position: "relative",
            pb: 1,
            textShadow: "1px 1px 1px rgba(255, 255, 255, 0.5)",
          }}
        >
          Change Password
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "4px",
              bgcolor: "#ee6c4d",
              borderRadius: "2px",
            }}
          />
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          px: { xs: 2, sm: 4, md: 7 },
          textAlign: "center",
        }}
      >
        {/* Current Password Field */}
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", sm: "400px" } }}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            autoComplete="off"
            margin="normal"
            sx={inputStyleFull}
            InputProps={{
              ...adornmentProps(<KeyIcon />),
            }}
          />
        </Box>

        {/* Display error message if present */}
        {error && (
          <Typography
            color="error"
            sx={{ mt: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }}
          >
            {error}
          </Typography>
        )}

        {/* New Password Field */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "400px" },
            position: "relative",
          }}
        >
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!isTypingPassword) setIsTypingPassword(true);
            }}
            fullWidth
            autoComplete="off"
            margin="normal"
            onFocus={() => setTooltipOpen(true)}
            onBlur={() => setTooltipOpen(false)}
            sx={inputStyleFull}
            InputProps={{
              ...adornmentProps(<LockIcon />),
            }}
          />

          {/* Tooltip for password requirements */}
          <Tooltip
            title={
              <Box sx={{ width: { xs: 180, sm: 230 }, p: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: 11, sm: 13 },
                    fontWeight: "bold",
                    color: "#293241",
                    mb: 1,
                  }}
                >
                  Password Requirements:
                </Typography>
                {[
                  {
                    label: "At least 8 characters",
                    valid: password.length >= 8,
                  },
                  {
                    label: "At least one uppercase letter",
                    valid: /[A-Z]/.test(password),
                  },
                  {
                    label: "At least one lowercase letter",
                    valid: /[a-z]/.test(password),
                  },
                  {
                    label: "At least one number",
                    valid: /[0-9]/.test(password),
                  },
                  {
                    label: "At least one special character",
                    valid: /[!@#$%^&*]/.test(password),
                  },
                  {
                    label: "Must not match current password",
                    valid: password !== currentPassword,
                  },
                ].map((item, index) => (
                  <Typography
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: { xs: 10, sm: 12 },
                      color: item.valid ? "green" : "red",
                      mb: 0.5,
                    }}
                  >
                    {item.valid ? "✔" : "✖"} {item.label}
                  </Typography>
                ))}
              </Box>
            }
            open={
              isTypingPassword &&
              ![
                password.length >= 8,
                /[A-Z]/.test(password),
                /[a-z]/.test(password),
                /[0-9]/.test(password),
                /[!@#$%^&*]/.test(password),
                password !== currentPassword,
              ].every(Boolean)
            }
            placement={isMobile ? "top" : isTablet ? "bottom" : "right-start"}
            arrow
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "#f5f5f5",
                  color: "#293241",
                  boxShadow: 2,
                  borderRadius: "8px",
                },
                "& .MuiTooltip-arrow": {
                  color: "#f5f5f5",
                },
              },
              modifiers: [
                { name: "offset", options: { offset: [0, -10] } },
                { name: "preventOverflow", options: { padding: 8 } },
              ],
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: isMobile ? "0" : "50%",
                right: isMobile ? "50%" : "-30px",
                transform: isMobile ? "translateX(50%)" : "none",
                width: 0,
                height: 0,
              }}
            />
          </Tooltip>
        </Box>

        {/* Confirm Password Field */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "400px" },
            position: "relative",
          }}
        >
          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            onFocus={() => setConfirmTooltipOpen(true)}
            onBlur={() => setConfirmTooltipOpen(false)}
            sx={inputStyleFull}
            InputProps={{
              ...adornmentProps(<EnhancedEncryptionIcon />),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleShowPassword}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Tooltip for password match validation */}
          <Tooltip
            title={
              <Typography
                sx={{
                  fontSize: { xs: 11, sm: 13 },
                  color: password === confirmPassword ? "green" : "red",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                {password === confirmPassword
                  ? "✔ Passwords match"
                  : "✖ Passwords do not match"}
              </Typography>
            }
            open={confirmPassword.length > 0 && password !== confirmPassword}
            placement={isMobile ? "top" : isTablet ? "bottom" : "right-start"}
            arrow
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "#f5f5f5",
                  color: "#293241",
                  boxShadow: 2,
                  borderRadius: "8px",
                  p: 1,
                },
                "& .MuiTooltip-arrow": {
                  color: "#f5f5f5",
                },
              },
              modifiers: [
                { name: "offset", options: { offset: [0, -10] } },
                { name: "preventOverflow", options: { padding: 8 } },
              ],
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: isMobile ? "0" : "50%",
                right: isMobile ? "50%" : "-20px",
                transform: isMobile ? "translateX(50%)" : "none",
                width: 0,
                height: 0,
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Submit button */}
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: { xs: 2, sm: 3 } }}
      >
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: { xs: "80%", sm: "200px" },
            borderRadius: "20px",
            backgroundColor: "#ee6c4d",
            color: "#fff",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            py: { xs: 1, sm: 1.5 },
            "&:hover": {
              backgroundColor: "#d95b38",
            },
          }}
        >
          Update Password
        </Button>
      </Box>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          width: { xs: "90%", sm: "auto" },
          maxWidth: "500px",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={errorMessage.includes("successfully") ? "success" : "error"}
          sx={{
            width: "100%",
            backgroundColor: "#F5F5DC",
            color: "#ee6c4d",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            fontSize: { xs: "0.85rem", sm: "1rem" },
            p: { xs: 1, sm: 2 },
            textAlign: "center",
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Setting;
