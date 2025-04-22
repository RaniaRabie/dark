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
import {
  FiMenu,
  FiSearch,
  FiHelpCircle,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import logo from "../../assests/devroots logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import axios from "axios";

const StyledAppBar = styled(AppBar)(() => ({
  background: "linear-gradient(90deg, #1a2634 0%, #293241 100%)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [userInfo, setUserInfo] = useState([])
    const { token, userId, login, logout } = useAuth();
    // const { userId } = useAuth();

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      fetchUserProfile(userId, token);
    }
  }, [token, userId] );

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/regesteration");
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
    { text: "About Us", id: "about-us" },
  ];

  const profileMenuItems = [
    { text: "Profile", icon: <FiUser />, path: "/updateUser" },
    { text: "Settings", icon: <FiSettings /> },
    { text: "Help Center", icon: <FiHelpCircle /> },
  ];

  const fetchUserProfile = async (userId, token) => {
    try {
      const response = await axios.get(
        `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(response.data); // Store profile data
      console.log(response.data)
    } catch (error) {
      setError('Failed to fetch user profile. Please try again.');
      console.error(error);
    } 
  };

  return (
    <StyledAppBar position="fixed" sx={{ top: 0, zIndex: 100 }}>
      <Toolbar sx={{ justifyContent: "space-between", padding: "0 16px" }}>
        {isMobile && (
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

        {!isMobile && (
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
                <Avatar
                  src={userInfo.imageUrl || ""}
                  alt="User Profile"
                />
              </IconButton>
            </Tooltip>
          ) : (
            <RigisterButton
              variant="contained"
              onClick={() => navigate("/regesteration")}
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
