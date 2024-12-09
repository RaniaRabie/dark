/*
- File Name: ForgotPassword.js
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  react-router-dom ,
  @react-oauth/google,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : a login component created by REACT and MUI
*/
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import EmailIcon from "@mui/icons-material/Email";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailTooltipOpen, setEmailTooltipOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for popup

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const emailPattern = /^[a-zA-Z0-9]{3,}(\.[a-zA-Z0-9]+)*@gmail\.com$/;
    const isValid = emailPattern.test(newEmail);
    setEmailError(!isValid);

    setEmailTooltipOpen(!isValid && newEmail.length > 0);
  };

  const handleEmailFocus = () => {
    const emailPattern = /^[a-zA-Z0-9]{3,}(\.[a-zA-Z0-9]+)*@gmail\.com$/;
    const isValid = emailPattern.test(email);
    setEmailTooltipOpen(!isValid);
  };

  const handleEmailBlur = () => {
    setEmailTooltipOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email field is empty
    if (!email) {
      setEmailError(true); // Set error state if email is empty
      setEmailTooltipOpen(true); // Show tooltip indicating email is required
      return; // Exit the function if email is empty
    }

    const emailPattern = /^[a-zA-Z0-9]{3,}(\.[a-zA-Z0-9]+)*@gmail\.com$/;
    if (!emailPattern.test(email)) {
      return; // Exit if email does not match the pattern
    }

    // إرسال البريد الإلكتروني للـ API
    try {
      console.log("hello from forgetpassword");
      const response = await fetch(
        "https://careerguidance.runasp.net/Auth/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setDialogOpen(true); // Open the popup when the form is submitted

        // Simulate a waiting period (for example, after an API call)
        setTimeout(() => {
          setDialogOpen(false); // Close the popup after 3 seconds
        }, 8000);
      } else {
        // في حالة وجود مشكلة في الطلب
        console.log("حدثت مشكلة في إرسال طلب إعادة تعيين كلمة المرور");
      }
    } catch (error) {
      console.log("خطأ في الاتصال بالـ API", error);
    }
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background,
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
        sx={{
          margin: "5px 0",
          color: theme.palette.text.primary,
          fontWeight: "bold",
        }}
      >
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Email field */}
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <TextField
            placeholder="Email"
            type="email"
            error={emailError}
            value={email}
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
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
                margin: "10px 0",
                border: "1px solid gray",
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiInputBase-root": {
                "&.Mui-focused": {
                  borderColor: "gray",
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
                    <EmailIcon
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

          {!isMobile && (
            <Tooltip
              title="Please enter a valid email"
              placement="right-end"
              open={emailTooltipOpen}
              arrow
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "#f5f5f5",
                    color: "#ee6c4d",
                    textTransform: "bold",
                    fontSize: 13,
                  },
                },
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [40, 0],
                    },
                  },
                ],
              }}
            />
          )}

          {isMobile && (
            <Tooltip
              title="Please enter a valid email"
              placement="bottom"
              open={emailTooltipOpen}
              arrow
              PopperProps={{
                sx: {
                  "& .MuiTooltip-tooltip": {
                    backgroundColor: "#f5f5f5",
                    color: "#ee6c4d",
                    textTransform: "bold",
                    fontSize: 13,
                  },
                },
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [-250, 40],
                    },
                  },
                ],
              }}
            />
          )}
        </Box>

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
            marginTop: 1,
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
          Send Reset Link
        </Button>
      </form>

      {/* Link to go back to the login page */}
      <Typography
        variant="body2"
        sx={{ marginTop: "10px", color: "#293241", fontWeight: "bold" }}
      >
        <Link
          to="/login"
          style={{ textDecoration: "none", color: theme.palette.text.primary }}
        >
          Back to Sign in
        </Link>
      </Typography>

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
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(34, 31, 31, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              width: "320px",
              height: "140px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            A password reset link has been sent to your email.
            <span
              style={{
                color: "#ee6c4d",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Please check your inbox or spam folder{" "}
            </span>
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ForgotPassword;
