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
import axios from "axios";
import { useAuth } from "context/AuthContext";

const Setting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <= 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  // State declarations
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

  const { userId } = useAuth();

  // Handlers
  const handleToggleShowPassword = () => setShowPassword(!showPassword);
  const handleCloseSnackbar = () => setOpenSnackbar(false);

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

      await axios.put(
        `https://careerguidance.runasp.net/api/userProfile/UpdatePassword/${userId}`,
        {
          ...userData,
          OldPassword: currentPassword,
          NewPassword: password,
          confirmPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setErrorMessage("Password updated successfully");
      setOpenSnackbar(true);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
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
  // Responsive TextField styles
  const textFieldStyle = {
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
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      width: { xs: "100%", sm: "320px" },
      height: { xs: "40px", sm: "37px" },
      margin: { xs: "10px 0", sm: "15px 0" },
      border: "1px solid gray",
      "& fieldset": {
        border: "none",
      },
    },
    "& .MuiInputBase-root": {
      "&.Mui-focused": {
        borderColor: "#ee6c4d",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: { xs: "0.9rem", sm: "1rem" },
    },
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "500px", md: "600px" },
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 2,
        boxShadow: { xs: 1, sm: 2 },
        backgroundColor: theme.palette.background.paper,
        minHeight: { xs: "auto", md: "400px" },
      }}
    >
      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 1, sm: 2 } }}>
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
            fontWeight: "bold",
            m: "auto",
            textShadow: "1px 1px 1px rgba(255, 255, 255, 0.5)",
          }}
        >
          Security Settings
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
            sx={textFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "2px solid #ee6c4d",
                      pr: 1,
                    }}
                  >
                    <KeyIcon
                      sx={{
                        color: "#ee6c4d",
                        fontSize: { xs: 24, sm: 30 },
                      }}
                    />
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Box>

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
            sx={textFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "2px solid #ee6c4d",
                      pr: 1,
                    }}
                  >
                    <LockIcon
                      sx={{
                        color: "#ee6c4d",
                        fontSize: { xs: 24, sm: 30 },
                      }}
                    />
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          {/* Tooltip for New Password */}
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
            sx={textFieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRight: "2px solid #ee6c4d",
                      pr: 1,
                    }}
                  >
                    <EnhancedEncryptionIcon
                      sx={{
                        color: "#ee6c4d",
                        fontSize: { xs: 24, sm: 30 },
                      }}
                    />
                  </Box>
                </InputAdornment>
              ),
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

          {/* Tooltip for Confirm Password */}
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

      {/* Submit Button */}
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

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
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
