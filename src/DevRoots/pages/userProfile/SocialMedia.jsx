import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Facebook, Instagram, LinkedIn, GitHub } from "@mui/icons-material";
import axios from "axios";
import { useAuth } from "context/AuthContext";

const socialMediaIcons = {
  instagram: <Instagram />,
  linkedIn: <LinkedIn />,
  gitHub: <GitHub />,
  facebook: <Facebook />,
};

const getSocialMediaColor = (platform) => {
  const colors = {
    instagram: "#E1306C",
    linkedIn: "#0A66C2",
    gitHub: "#333",
    facebook: "#1877F2",
  };
  return colors[platform] || "#000";
};

const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:[0-9]{1,5})?(\/.*)?$/i;

const SocialMedia = () => {
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
  const token = localStorage.getItem("accessToken");
  const { userId } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
        setMessage("Error fetching user data.");
        setSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [token, userId]);

  const validateLink = (platform, value) => {
    const trimmed = value.trim();
    const platformCheck = trimmed
      .toLowerCase()
      .includes(`${platform.toLowerCase()}.com`);
    if (!trimmed) return "Please enter a link!";
    if (!urlRegex.test(trimmed)) return "Invalid URL!";
    if (!platformCheck) return `Link must contain "${platform}.com"`;
    return "";
  };

  const handleTempSocialInputChange = (platform, e) => {
    const value = e.target.value;
    const error = validateLink(platform, value);

    setTempLinks((prev) => ({ ...prev, [platform]: value }));
    setSocialErrors((prev) => ({ ...prev, [platform]: error }));
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

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
      const response = await axios.get(
        `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data;
      const updatedData = {
        ...userData,
        facebook: tempLinks.facebook,
        instagram: tempLinks.instagram,
        gitHub: tempLinks.gitHub,
        linkedIn: tempLinks.linkedIn,
      };

      await axios.put(
        `https://careerguidance.runasp.net/api/userProfile/UpdateProfile/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  const handleKeyDown = (e, platform) => {
    if (e.key === "Enter") {
      const error = validateLink(platform, tempLinks[platform]);
      setSocialErrors((prev) => ({ ...prev, [platform]: error }));

      if (!error) {
        handleSave();
      } else {
        setMessage(error);
        setSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Box
      onKeyDown={handleKeyPress}
      sx={{
        width: "40%",

        mx: "auto",
        p: { xs: 3, sm: 5 },
        borderRadius: "16px",
        boxShadow: theme.shadows[4],
        backgroundColor: theme.palette.background.paper,
        mt: { xs: 3, md: 6 },
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: 24, md: 36 },
            fontWeight: "bold",
            m: "auto",
            textShadow: "1px 1px 1px rgb(255, 255, 255)",
          }}
        >
          Social Media Links
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {Object.entries(tempLinks).map(([platform, value]) => (
          <Box
            key={platform}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <IconButton
              sx={{
                backgroundColor: getSocialMediaColor(platform),
                color: "#fff",
                "&:hover": {
                  backgroundColor: `${getSocialMediaColor(platform)}CC`,
                },
              }}
            >
              {socialMediaIcons[platform]}
            </IconButton>

            <Tooltip
              title={socialErrors[platform] || ""}
              open={!!socialErrors[platform]}
              placement="top"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#f44336",
                    color: "#fff",
                    fontSize: "14px",
                  },
                },
              }}
            >
              <TextField
                placeholder={`Enter your ${platform} link`}
                value={value}
                onChange={(e) => handleTempSocialInputChange(platform, e)}
                onKeyDown={(e) => handleKeyDown(e, platform)}
                fullWidth
                error={!!socialErrors[platform]}
                variant="outlined"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    height: "40px",
                    fontSize: "13px",
                    border: "1px solid gray",
                    "& fieldset": { border: "none" },
                  },
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          onKeyDown={handleKeyPress}
          sx={{
            width: "150px",
            borderRadius: "20px",
            backgroundColor: "#ee6c4d",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#d95b38",
            },
          }}
        >
          Save
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={severity}
          sx={{ borderRadius: "8px", fontSize: "16px", width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialMedia;
