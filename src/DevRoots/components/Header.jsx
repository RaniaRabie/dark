/*
- File Name: Header.jsx
- Author: 
- Date of Creation: 10/4/2025
- Versions Information: 1.0.0
- Dependencies:
  {
    React,
    @mui/material,
    @mui/system,
    react-icons/fi,
    react-router-dom,
    axios,
    context/AuthContext
  }
- Contributors: Shrouk Ahmed,Nourhan Khaled,Rania Rabie
- Last Modified Date: 01/5/2025
- Description: Navigation bar component with profile menu, search, theme toggle, and role-based access control
*/

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  Tooltip,
  InputAdornment,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiMenu, FiSearch, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import logo from "../../assests/devroots logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { api } from "../../services/axiosInstance";
import { Tablet } from "@mui/icons-material";

const StyledAppBar = styled(AppBar)(() => ({
  background: "linear-gradient(90deg, #1a2634 0%, #293241 100%)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    // "&::after": {
    //   content: '""',
    //   position: "absolute",
    //   bottom: 0,
    //   left: 0,
    //   right: 0,
    //   height: "3px",
    //   background: "linear-gradient(90deg, #ee6c4d 0%, #7c4dff 100%)",
    // },
}));

const Logo = styled("img")({
  height: "30px",
  maxWidth: "160px",
  cursor: "pointer",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const NavButton = styled(Button)(() => ({
  color: "#ffffff",
  margin: "0 12px",
  padding: "8px 16px",
  borderRadius: "0", // Removed border radius for cleaner underline effect
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: "color 0.2s ease",
  position: "relative",
  display: "inline-block", // Ensures underline aligns with text width
  textAlign: "center",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: "50%",
    transform: "translateX(-50%)", // Centers the underline under the text
    width: 0,
    height: "2px",
    background: "#ee6d4f",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%", // Matches the text width due to inline-block
  },
  "&:hover": {
    color: "#ee6d4f",
  },
}));

const SearchField = styled(TextField)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  transition: "all 0.3s ease",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ee6d4f",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
    fontSize: "0.9rem",
    padding: "10px",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.6)",
    opacity: 1,
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
}));

const RigisterButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #293241 30%, #ee6d4f 90%)",
  borderRadius: "15px",
  padding: "5px 15px",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  color: "#ffffff",
  transition: "all 0.3s ease",
  "&:hover": {
    // background: "linear-gradient(45deg, #ff8e53 30%, #ee6d4f 90%)",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(238, 109, 79, 0.4)",
  },
}));

const Header = ({ setMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isBigger = useMediaQuery(theme.breakpoints.up("lg"));

  const [userInfo, setUserInfo] = useState({});
  const { user, logout } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      fetchUserProfile(user?.id);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/registration");
    setIsLoggedIn(false);
  };

  const toggleTheme = () => {
    const newMode = theme.palette.mode === "light" ? "dark" : "light";
    localStorage.setItem("currentMode", newMode);
    setMode(newMode);
  };

  const navigationItems = [
    { text: "Home", id: "home", path: "/" },
    { text: "Start Here", id: "startHere", path: "/startHere" },
    { text: "All Roadmaps", id: "all-roaadmaps", path: "/allroadmaps" },
    { text: "Interviews", id: "interviews" },
    { text: "About Us", id: "about-us", path: "/about-us" },
  ];

  const profileMenuItems = [
    ...(user?.role !== "Admin"
      ? [{ text: "Profile", icon: <FiUser />, path: "/userProfile" }]
      : []),
    ...(user?.role === "Admin"
      ? [{ text: "Dashboard", icon: <FiGrid />, path: "dashboard" }]
      : []),
  ];

  const fetchUserProfile = async (userId) => {
    try {
      const response = await api.get(`/api/userProfile/GetUserById/${userId}`);
      setUserInfo(response.data); // Store profile data
      console.log(response.data);
    } catch (error) {
      setError("Failed to fetch user profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <StyledAppBar position="fixed" sx={{ top: 0, zIndex: 100 }}>
      <Toolbar sx={{ justifyContent: "space-between", padding: "0 16px" }}>
        {(isMobile || isTablet) && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="menu"
            sx={{ color: "#ffffff" }}
          >
            <FiMenu size={24} />
          </IconButton>
        )}

        <Logo
          src={logo}
          alt="DevRoots Logo"
          onClick={() => navigate("/")}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=150&h=40&fit=crop&auto=format";
          }}
        />

        {(isTablet && !isMobile)  && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SearchField
              placeholder="Search ..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color="#ffffff" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "320px" }}
            />
          </Box>
        )}

        {(isBigger) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {navigationItems.map((item) => (
                <NavButton key={item.id} onClick={() => navigate(item.path)}>
                  <Typography variant="button">{item.text}</Typography>
                </NavButton>
              ))}
            </Box>
            <SearchField
              placeholder="Search ..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color="#ffffff" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "320px" }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Toggle Theme">
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{
                color: "#ffffff",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              {theme.palette.mode === "light" ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>

          {isLoggedIn ? (
            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <Avatar src={userInfo.imageUrl || ""} alt="User Profile" />
              </IconButton>
            </Tooltip>
          ) : (
            <RigisterButton
              variant="contained"
              onClick={() => navigate("/registration")}
            >
              Register
            </RigisterButton>
          )}
        </Box>

        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
              onClick={() => {
                navigate(item.path);
              }}
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
          <MenuItem
            onClick={() => {
              handleLogout();
              handleProfileMenuClose();
            }}
            sx={{
              gap: 1,
              padding: "10px 16px",
              "&:hover": {
                backgroundColor: "rgba(238, 109, 79, 0.2)",
              },
            }}
          >
            <FiLogOut />
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: {
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #293241 0%, #1a2634 100%)"
                  : "linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)",
            },
          }}
        >
          <List sx={{ width: 200, padding: "16px" }}>
            {navigationItems.map((item) => (
              <ListItem key={item.id} sx={{ padding: "4px 0" }}>
                <NavButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="button"
                    sx={{
                      color: theme.palette.text.primary,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    {item.text}
                  </Typography>
                </NavButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
