// @ts-ignore
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountCircle,
  Person,
  Security,
  Timeline,
  ExitToApp,
  Login,
  Email,
  Work,
} from "@mui/icons-material";
import { FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom";
import {api} from "../../../services/axiosInstance"


// Base tab items (excluding login/logout, which will be added dynamically)
const tabItems = [
  { icon: <AccountCircle />, label: "Profile Settings" },
  { icon: <Person />, label: "SocialMedia" },
  { icon: <Security />, label: "Security" },
  { icon: <Timeline />, label: "Roadmap" },
  { icon: <ExitToApp />, label: "Logout" }
];

const SideBaR = ({ tab, setTab }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuth(); // Use AuthContext
  const userId = user?.id;

  // Fetch user info when userId 
  useEffect(() => {

    if (userId ) {
      api
      .get(
        `/api/userProfile/GetUserById/${userId}`,

      )
      .then((res) => {
        setUserInfo(res.data || {});
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
      });
    } else {
      setUserInfo({}); // Clear user info if not logged in
    }
  }, [userId]);

  // Handle tab clicks
  const handleTabClick = (label) => {
    if (label === "Logout") {
      logout();
      navigate("/registration");
      window.location.reload();
    }
  };

  // Dynamically set tab items based on authentication state

  const sidebarWidth = isOpen ? (isMobile ? 240 : 300) : 64;
  const typographySx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
    fontSize: "0.9rem",
    fontWeight: 500,
    color: theme.palette.mode === "dark" ? "#E0E0E0" : "#333",
    ...(theme.palette.mode === "dark" && {
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
    }),
  };

  return (
    <motion.div
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, type: "spring", damping: 15 }}
      style={{
        position: "fixed",
        top: isMobile ? 50 : 64,
        left: 0,
        height: "calc(100vh)",
        background: 
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, #1E2A3C 0%, #2A3B52 100%)"
            : "linear-gradient(180deg, #F5F7FA 0%, #E8ECEF 100%)",
        color: theme.palette.mode === "dark" ? "#E0E0E0" : "#333",
        zIndex: 1200,
        overflowY: "auto",
        boxShadow:
          theme.palette.mode === "dark"
            ? "2px 0 8px rgba(0, 0, 0, 0.5)"
            : "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isOpen? "flex-end": "flex-start",
          p: 1.5,
          cursor: "pointer",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars
          size={22}
          color={theme.palette.mode === "dark" ? "#E0E0E0" : "#333"}
        />
      </Box>

      {/* Avatar + Info (only shown when logged in) */}
      <Box>
        <AnimatePresence>
          {isOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: isMobile ? 3 : 4,
                textAlign: "center",
              }}
            >
              <Avatar
                alt="Profile"
                src={userInfo.imageUrl}
                sx={{
                  width: isMobile ? 100 : 120,
                  height: isMobile ? 100 : 120,
                  mx: "auto",
                  mb: 2,
                  border: `2px solid ${
                    theme.palette.mode === "dark" ? "#ee6c4d" : "#333"
                  }`,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1.5,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.9)",
                  p: 2,
                  mx: "auto",
                  maxWidth: isMobile ? "90%" : 260,
                  borderRadius: 2,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                      : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Typography variant="body1" sx={typographySx}>
                  <Person sx={{ color: "#ee6c4d", fontSize: 20 }} />
                  <strong>Username:</strong> {userInfo?.userName || "N/A"}
                </Typography>
                <Typography variant="body1" sx={typographySx}>
                  <Email sx={{ color: "#ee6c4d", fontSize: 20 }} />
                  <strong>Email:</strong> {userInfo?.email || "N/A"}
                </Typography>
                <Typography variant="body1" sx={typographySx}>
                  <Work sx={{ color: "#ee6c4d", fontSize: 20 }} />
                  <strong>Role:</strong> {userInfo?.role || "N/A"}
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      {/* Tabs */}
      <Tabs
        orientation="vertical"
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mt: 2,
          ".MuiTab-root": {
            minHeight: 56,
            color: theme.palette.mode === "dark" ? "#E0E0E0" : "#333",
            px: isOpen ? 3 : 1,
            textTransform: "none",
            fontSize: isOpen ? "1rem" : "0.75rem",
            fontWeight: 500,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
              transform: "scale(1.02)",
            },
          },
          ".MuiTab-iconWrapper": {
            fontSize: isOpen ? 28 : 24,
            marginRight: isOpen ? 1.5 : 0,
            color: theme.palette.mode === "dark" ? "#E0E0E0" : "#333",
          },
          ".Mui-selected": {
            color: "#ee6c4d !important",
            fontWeight: 700,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(238, 108, 77, 0.2)"
                : "rgba(238, 108, 77, 0.1)",
          },
          ".MuiTabs-indicator": {
            backgroundColor: "#ee6c4d",
            width: isOpen ? 5 : 3,
            borderRadius: "0 2px 2px 0",
          },
        }}
      >
        {tabItems.map((item, index) => (
          <Tab
            key={index}
            icon={item.icon}
            label={isOpen ? item.label : ""}
            onClick={() => handleTabClick(item.label)}
          />
        ))}
      </Tabs>
    </motion.div>
  );
};

export default SideBaR;
