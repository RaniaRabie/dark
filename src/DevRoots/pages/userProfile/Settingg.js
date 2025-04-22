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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import axios from "axios";
import { useAuth } from "context/AuthContext";

const Setting = () => {
  const handleCloseSnackbar = () => setOpenSnackbar(false);
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
  const handleToggleShowPassword = () => setShowPassword(!showPassword);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  //////////////////////////////////////////
  const { userId } = useAuth();

  // Verify the current password
  const handleSubmit = async () => {
    const validations = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      match: password === confirmPassword,
    };
    if (password === currentPassword) {
      setErrorMessage(
        "New password must not be the same as the current password"
      );
      setOpenSnackbar(true);
      return;
    }

    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setErrorMessage("Please meet all the password requirements.");
      setOpenSnackbar(true);
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      const verifyResponse = await axios.get(
        `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = verifyResponse.data;

      // if (userData.OldPassword !== currentPassword) {
      //   setErrorMessage("Current password is incorrect.");
      //   setOpenSnackbar(true);
      //   return;
      // }

      await axios.put(
        `https://careerguidance.runasp.net/api/userProfile/UpdatePassword/${userId}`,
        {
          ...userData,
          OldPassword: currentPassword,
          NewPassword: password,
          confirmPassword:password
          
          
        },
          
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setErrorMessage(" Password updated successfully");
      setOpenSnackbar(true);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const msg =
        error.response?.data?.errors?.[0] || "An unexpected error occurred.";
      setErrorMessage(` ${msg}`);
      setOpenSnackbar(true);
    }
  };
    

  ///////////////////////
  const textFieldStyle = {
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 10px transparent inset", // Make the autofill background transparent
      backgroundColor: "transparent",
      WebkitTextFillColor: "#293241", // Maintain your desired text color
      transition: "background-color 5000s ease-in-out 0s", // A trick to override autofill background
    },
    "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
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
        borderColor: "#ee6c4d", // Remove focus color
      },
    },
  };

  const theme = useTheme();
  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 500 }, // Use full width on extra small screens
        mx: "auto",
        p: { xs: 2, sm: 4 }, // Adjust padding based on screen size
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          //  variant="h5" align="center" gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: 24, md: 36 }, // Adjust font size for different screens
            fontWeight: "bold",
            m: "auto",
            textShadow: "1px 1px 1pxrgb(255, 255, 255)",
          }}
        >
          Security Settings
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // تخلي العناصر في النص أفقيًا
          justifyContent: "center",
          width: "100%",
          px: 7,
          textAlign: "center", // تخلي النص في الوسط برضو
        }}
      >
        {/* Current Password Field */}
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            autoComplete="off"
            margin="normal"
            sx={textFieldStyle}
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
                    <KeyIcon
                      style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }}
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {/* New Password Field */}
        <Box sx={{ width: "100%", maxWidth: 400, position: "relative" }}>
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
            sx={textFieldStyle}
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
                      style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }}
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />

          {/* Tooltip for New Password */}
          <Tooltip
            title={
              <Box sx={{ width: 230, p: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 13,
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
                      fontSize: "12px",
                      color: item.valid ? "green" : "red",
                      mb: 0.5,
                    }}
                  >
                    {item.valid ? "✔" : "✖"}&nbsp;{item.label}
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
            } // طول ما فيه شرط مش متحقق يفضل ظاهر
            placement="right-start"
            arrow
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "#f5f5f5",
                  color: "#293241",
                  boxShadow: 2,
                  borderRadius: "8px",
                },
              },
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [-15, -15],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    padding: 0,
                  },
                },
              ],
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: "-30px",
                width: 0,
                height: 0,
              }}
            />
          </Tooltip>
        </Box>

        {/* Confirm Password Field */}
        <Box sx={{ width: "100%", maxWidth: 500, position: "relative" }}>
          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            onFocus={() => setConfirmTooltipOpen(true)}
            onBlur={() => setConfirmTooltipOpen(false)}
            sx={textFieldStyle}
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
                    <EnhancedEncryptionIcon
                      style={{ color: "#ee6c4d", fontSize: 30, marginRight: 5 }}
                    />
                  </div>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Tooltip for Confirm Password Match */}
          <Tooltip
            title={
              <Typography
                sx={{
                  fontSize: 13,
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
            placement="right-start"
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
              },
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [-10, -15],
                  },
                },
                {
                  name: "preventOverflow",
                  options: {
                    padding: 0,
                  },
                },
              ],
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                right: "-20px",
                width: 0,
                height: 0,
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            width: "200px",
            borderRadius: "20px",
            backgroundColor: "#ee6c4d",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#d95b38",
            },
          }}
        >
          Update Password
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
  );
};

export default Setting;

