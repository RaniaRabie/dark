/*
- File Name: TopBar.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.2
- Dependencies:
  {
  REACT,
  react-router-dom,
  MUI,
  axios,
  AuthContext,
  react-icons/fi
  }
- Contributors: shrouk ahmed, Nourhan khaled, rania rabie
- Last Modified Date: 30/4/2025
- Description: Top navigation bar with user avatar, dropdown menu for Profile and Home functionality
*/

import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  AppBar as MuiAppBar,
  styled,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { FiUser, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import {api} from "../../services/axiosInstance"

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, toggleMode, mode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ imageUrl: "" });
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { user } = useAuth();
  const userId = user?.id

  // Fetch user data
  useEffect(() => {
    if (userId) {
      api
        .get(`/api/userProfile/GetUserById/${userId}`)
        .then((response) => {
          const data = response.data || {};
          setUserInfo({
            imageUrl: data.imageUrl || "",
          });
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [userId]);

  // Handle dropdown menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Profile menu items
  const profileMenuItems = [
    { text: "Profile", icon: <FiUser />, path: "/dashboard/setting" },
    { text: "Home", icon: <FiHome />, path: "/" },
  ];

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        height: "50px",
        background: "#1d242f !important",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 0, sm: 0 } }}>
        <Box flexGrow="1" />
        <Stack direction="row" spacing={1}>
          {/* Dark mode toggle button */}
          <IconButton onClick={toggleMode} color="inherit">
            {mode === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>

          {/* User Avatar with Dropdown */}
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
            sx={{
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Avatar
              alt="User Profile"
              src={userInfo.imageUrl}
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                border: `2px solid ${theme.palette.mode === "dark" ? "#ee6c4d" : "#fff"}`,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              {!userInfo.imageUrl && <Person2OutlinedIcon />}
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                background: "linear-gradient(135deg, #293241 0%, #1a2634 100%)",
                color: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                minWidth: "180px",
              },
            }}
          >
            {profileMenuItems.map((item) => (
              <MenuItem
                key={item.text}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  gap: 1,
                  padding: "10px 16px",
                  "&:hover": {
                    backgroundColor: "rgba(238, 109, 79, 0.2)",
                  },
                }}
              >
                {item.icon}
                <Typography>{item.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;