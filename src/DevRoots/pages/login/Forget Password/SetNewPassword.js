/*
- Name: SetNewPassword.js
- author: shrouk ahmed
- Date of creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  react-router-dom ,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
*/
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Tooltip,
  List,
  ListItem,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogContent,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom"; // useLocation بدلاً من useParams
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [ConfirmtooltipOpen, setConfirmTooltipOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for popup

  // استخدام useLocation للحصول على الـ query parameters
  const location = useLocation();

  // استخدم useEffect للحصول على الـ email والـ code من الـ query parameters عند تحميل الصفحة
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromURL = params.get("email");
    const codeFromURL = params.get("code");

    console.log("Email from URL:", emailFromURL);
    console.log("Code from URL:", codeFromURL);
  }, [location.search]);

  const validations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
    match: password && confirmPassword ? confirmPassword === password : false,
  };

  const validationCriteria = [
    { label: "At least 8 characters", valid: validations.minLength },
    { label: "At least one uppercase letter", valid: validations.hasUpperCase },
    { label: "At least one lowercase letter", valid: validations.hasLowerCase },
    { label: "At least one number", valid: validations.hasNumber },
    {
      label: "At least one special character",
      valid: validations.hasSpecialChar,
    },
  ];

  const ConfirmValidationCriteria = [
    { label: "Passwords match", valid: validations.match },
  ];

  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const params = new URLSearchParams(location.search);
    const emailFromURL = params.get("email");
    const codeFromURL = params.get("code");

    const newPasswordData = {
      email: emailFromURL,
      code: codeFromURL,
      newPassword: password,
    };

    try {
      const response = await fetch(
        "https://careerguidance.runasp.net/Auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPasswordData),
        }
      );
      if (response.ok) {
        setDialogOpen(true); // Open the popup when the form is submitted

        // Simulate a waiting period (for example, after an API call)
        setTimeout(() => {
          setDialogOpen(false); // Close the popup after 3 seconds
        }, 5000);
      }
      if (response.ok) {
        const data = await response.json();
        console.log("Password Updated successful:", data);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const isMobilee = useMediaQuery("(max-width:600px)");
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh", // Full viewport height to center vertically
        padding: "20px",
        width: "100%",

      }}
    >
      <Typography
        variant="h5"
        sx={{ margin: "8px 10px", color:theme.palette.text.primary, fontWeight: "bold" }}
      >
        Set New Password
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "400px", // Limit the width for better responsiveness
        }}
      >
        {/* Password field with tooltip */}
        <Tooltip
          title={
            <Box sx={{ width: 180 }}>
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: "bold", color: "#293241" }}
              >
                Password Requirements:
              </Typography>
              <List>
                {validationCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? "green" : "red"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "10px",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {item.valid ? "✔" : "✖"} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={tooltipOpen && validationCriteria.some((item) => !item.valid)}
          placement={isMobilee ? "bottom" : "right-start"} // Conditionally set the placement
          arrow
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isMobilee ? [0, -5] : [0, -8], // Larger vertical offset for mobile mode
                },
              },
            ],
            sx: {
              "& .MuiTooltip-tooltip": {
                backgroundColor: "#f5f5f5",
                color: "#293241",
              },
            },
          }}
        >
          <TextField
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTooltipOpen(true);
            }}
            onBlur={() => {
              setTooltipOpen(false);
            }}
            onFocus={() => {
              setTooltipOpen(true);
            }}
            sx={{
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
                  <LockIcon
                    style={{
                      color: "#ee6c4d",
                      fontSize: 30,
                      marginRight: 5,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>

        {/* Confirm Password field with tooltip */}
        <Tooltip
          title={
            <Box sx={{ width: 180 }}>
              <Typography
                variant="h6"
                sx={{ fontSize: 13, fontWeight: "bold", color: "#293241" }}
              >
                Password Requirements:
              </Typography>
              <List>
                {ConfirmValidationCriteria.map((item, index) => (
                  <ListItem key={index} sx={{ padding: 0, margin: 0 }}>
                    <Typography
                      color={item.valid ? "green" : "red"}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "10px",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {item.valid ? "✔" : "✖"} {item.label}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          }
          open={
            ConfirmtooltipOpen &&
            ConfirmValidationCriteria.some((item) => !item.valid)
          }
          arrow
          placement={isMobilee ? "bottom" : "right-start"} // Conditionally set the placement
          PopperProps={{
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isMobilee ? [0, -15] : [0, -8], // Larger vertical offset for mobile mode
                },
              },
            ],
            sx: {
              "& .MuiTooltip-tooltip": {
                backgroundColor: "#f5f5f5",
                color: "#293241",
              },
            },
          }}
        >
          <TextField
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmTooltipOpen(true)}
            onBlur={() => setConfirmTooltipOpen(false)}
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
                  <EnhancedEncryptionIcon
                    style={{
                      color: "#ee6c4d",
                      fontSize: 30,
                      marginRight: 5,
                    }}
                  />
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
        </Tooltip>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#ee6c4d",
            color: "#fff",
            fontSize: "12px",
            padding: "10px 45px",
            borderRadius: "8px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(34, 31, 31, 0.3)",
            transition: "0.5s ease",
            "&:hover": {
              backgroundColor: "#ee5c3d",
            },
          }}
        >
          Reset Password
        </Button>
      </form>
      {/* Popup Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#293241",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(34, 31, 31, 0.3)",
              backgroundColor: "#f7f7f7",
              borderRadius: "12px",
              padding: "20px",
              width: "320px",
              height: "140px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            A password Updated successfully.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SetNewPassword;
