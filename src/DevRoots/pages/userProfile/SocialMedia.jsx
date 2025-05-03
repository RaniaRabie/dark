/*
- File Name: SocialMedia.jsx
- Author:Nourhan Khaled
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
- Contributors: 
 - Last Modified Date: 2/5/2025
- Description: Component for managing and updating user social media links with validation and API integration
*/

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import {
  CheckCircle,
  Error,
  Facebook,
  Instagram,
  LinkedIn,
  GitHub,
} from "@mui/icons-material";
import { useAuth } from "context/AuthContext";
import { api } from "../../../services/axiosInstance";

// Define social media icons for input adornments
const socialMediaIcons = {
  instagram: <Instagram />,
  linkedIn: <LinkedIn />,
  gitHub: <GitHub />,
  facebook: <Facebook />,
};

// Get platform-specific colors for icons
const getSocialMediaColor = (platform) => {
  const colors = {
    instagram: "#E1306C",
    linkedIn: "#0A66C2",
    gitHub: "#333",
    facebook: "#1877F2",
  };
  return colors[platform] || "#000";
};

// Regex for URL validation
const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:[0-9]{1,5})?(\/.*)?$/i;

// SocialMedia component for managing user social media links
const SocialMedia = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const userId = user?.id;

  // State for social media links, temporary inputs, errors, and snackbar
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    linkedIn: "",
    gitHub: "",
    facebook: "",
  });
  const [tempLinks, setTempLinks] = useState({ ...socialLinks });
  const [socialErrors, setSocialErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  // Fetch user social media data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setMessage("Please log in to view your profile.");
        setSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      try {
        const res = await api.get(`/api/userProfile/GetUserById/${userId}`);

        const userData = res.data;
        const links = {
          facebook: userData.facebook || "",
          instagram: userData.instagram || "",
          gitHub: userData.gitHub || "",
          linkedIn: userData.linkedIn || "",
        };

        setSocialLinks(links);
        setTempLinks(links);
      } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.response?.status === 401) {
          setMessage("Session expired. Please log in again.");
          setSeverity("error");
        } else {
          setMessage("Error fetching user data.");
          setSeverity("error");
        }
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [userId]);

  // Validate social media link format and platform relevance
  const validateLink = useCallback((platform, value) => {
    const trimmed = value.trim();
    if (!trimmed) return ""; // Allow empty fields
    if (!urlRegex.test(trimmed)) return "Invalid URL!";
    const platformCheck = trimmed
      .toLowerCase()
      .includes(platform.toLowerCase());
    if (!platformCheck) return `Link must contain "${platform}"`;
    return "";
  }, []);

  // Handle input changes and validate in real-time
  const handleTempSocialInputChange = (platform, e) => {
    const value = e.target.value;
    const error = validateLink(platform, value);

    setTempLinks((prev) => ({ ...prev, [platform]: value }));
    setSocialErrors((prev) => ({ ...prev, [platform]: error }));
  };

  // Save a single social media link (triggered by Enter key)
  const handleSaveSingleLink = async (platform) => {
    const value = tempLinks[platform];
    const error = validateLink(platform, value);

    if (error) {
      setSocialErrors((prev) => ({ ...prev, [platform]: error }));
      setMessage(`Please fix the error in ${platform} link before saving.`);
      setSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await api.get(`/api/userProfile/GetUserById/${userId}`);

      const userData = response.data;
      const updatedData = {
        ...userData,
        [platform]: value,
      };

      await api.put(`/api/userProfile/UpdateProfile/${userId}`, updatedData);

      setSocialLinks((prev) => ({ ...prev, [platform]: value }));
      setMessage(`${platform} link saved successfully!`);
      setSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        `Error saving ${platform} link:`,
        error.response?.data || error.message
      );
      setMessage(`Failed to save ${platform} link.`);
      setSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Save all social media links (triggered by Save button)
  const handleSave = async () => {
    const newErrors = {};
    Object.entries(tempLinks).forEach(([platform, value]) => {
      const error = validateLink(platform, value);
      if (error) newErrors[platform] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setSocialErrors(newErrors);
      setMessage("Please fix the errors before saving.");
      setSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await api.get(`/api/userProfile/GetUserById/${userId}`);

      const userData = response.data;
      const updatedData = {
        ...userData,
        facebook: tempLinks.facebook,
        instagram: tempLinks.instagram,
        gitHub: tempLinks.gitHub,
        linkedIn: tempLinks.linkedIn,
      };

      await api.put(`/api/userProfile/UpdateProfile/${userId}`, updatedData);

      setSocialLinks(tempLinks);
      setMessage("Links saved successfully!");
      setSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error(
        "Error saving data:",
        error.response?.data || error.message
      );
      setMessage("Failed to save links.");
      setSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Cancel changes and revert to saved links
  const handleCancel = () => {
    setTempLinks({ ...socialLinks });
    setSocialErrors({});
    setMessage("Changes cancelled.");
    setSeverity("info");
    setSnackbarOpen(true);
  };

  // Handle Enter key press for individual link fields
  const handleKeyDown = (platform, e) => {
    if (e.key === "Enter") {
      handleSaveSingleLink(platform);
    }
  };

  // Handle Enter key press for Save/Cancel buttons
  const handleButtonKeyDown = (action, e) => {
    if (e.key === "Enter") {
      if (action === "save") {
        handleSave();
      } else if (action === "cancel") {
        handleCancel();
      }
    }
  };

  // Render the social media link form
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        Height: "calc(100vh - 64px)",
        // pt: { xs: 8, sm: 10 },
        // pl: { xs: 0, sm: 32 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main container with animated entrance */}
      <Box
        sx={{
          width: { xs: "100%", sm: "80%", md: "100%" }, // Responsive width
          maxWidth: { xs: "100%", sm: "500px", md: "600px" }, // Prevent overly wide box
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
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              position: "relative",
              pb: 1,
              opacity: 0,
              animation: "fadeInDown 0.5s ease-out forwards",
              "@keyframes fadeInDown": {
                to: {
                  opacity: 1,
                },
              },
            }}
          >
            Social Media Links
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "4px",
                bgcolor: "#ee6d4f",
                borderRadius: "2px",
              }}
            />
          </Typography>
        </Box>

        {/* Social media input fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {Object.entries(tempLinks).map(([platform, value], index) => (
            <Box
              key={platform}
              sx={{
                opacity: 0,
                animation: `fadeIn 0.5s ease-out ${
                  0.2 + index * 0.1
                }s forwards`,
                "@keyframes fadeIn": {
                  to: { opacity: 1 },
                },
              }}
            >
              <TextField
                placeholder={`Add your ${platform} link`}
                value={value}
                onChange={(e) => handleTempSocialInputChange(platform, e)}
                onKeyDown={(e) => handleKeyDown(platform, e)}
                fullWidth
                error={!!socialErrors[platform]}
                helperText={socialErrors[platform]}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#ee6d4f",
                      boxShadow: "0 0 8px rgba(238, 109, 79, 0.3)",
                    },
                    "&.Mui-focused": {
                      borderColor: "#ee6d4f",
                      boxShadow: "0 0 12px rgba(238, 109, 79, 0.5)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& .MuiInputBase-input": {
                      color: theme.palette.text.primary,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      p: { xs: "10px 12px", sm: "12px 14px" },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    ml: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          color: getSocialMediaColor(platform),
                          fontSize: { xs: "1.2rem", sm: "1.4rem" },
                          mr: 1,
                        }}
                      >
                        {socialMediaIcons[platform]}
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {socialErrors[platform] ? (
                        <Error sx={{ color: "#f44336", fontSize: "1.2rem" }} />
                      ) : value && !socialErrors[platform] && value.trim() ? (
                        <CheckCircle
                          sx={{ color: "#4caf50", fontSize: "1.2rem" }}
                        />
                      ) : null}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Save and Cancel buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            onKeyDown={(e) => handleButtonKeyDown("save", e)}
            sx={{
              bgcolor: "#ee6d4f",
              color: "#fff",
              borderRadius: "12px",
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#d95b38",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(238, 109, 79, 0.4)",
              },
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            onKeyDown={(e) => handleButtonKeyDown("cancel", e)}
            sx={{
              borderColor: "#ee6d4f",
              color: "#ee6d4f",
              borderRadius: "12px",
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#ee6d4f",
                color: "#ee6d4f",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Cancel
          </Button>
        </Box>

        {/* Snackbar for user feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: isMobile ? "bottom" : "top",
            horizontal: "center",
          }}
          sx={{
            opacity: 0,
            animation: "fadeIn 0.3s ease-out forwards",
            "@keyframes fadeIn": {
              to: { opacity: 1 },
            },
          }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={severity}
            sx={{
              borderRadius: "8px",
              bgcolor: severity === "success" ? "#4caf50" : "#f44336",
              color: "#fff",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              width: { xs: "90%", sm: "400px" },
              p: { xs: 1, sm: 1.5 },
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SocialMedia;
