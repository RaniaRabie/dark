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
  ListItem,
  ListItemText,
  Tooltip,
  InputAdornment,
  Stack,
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

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#293241",
  // backgroundColor: "rgba(0, 0, 0, 0.1)",
  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
}));

const Logo = styled("img")({
  height: "25px",
  maxWidth: "143px",
  cursor: "pointer",
});

const SearchField = styled(TextField)(({ theme }) => ({
    backgroundColor: "#49515d",
    borderRadius: "4px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "transparent",
      },
      "&:hover fieldset": {
        borderColor: "transparent",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ee6d4f",
      },
    },
    "& .MuiInputBase-input": {
      color: "white", // Set text color to white
    },
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(255, 255, 255, 0.7)", // Optional: Adjust placeholder color
    },
  }));
  

const NavButton = styled(Button)(({ theme }) => ({
  color: "#333333",
  margin: "0 8px",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.04)",
  },
}));

const JobPortalHeader = ({ setMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      }
    }, []);
    
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
    { text: "Home", id: "jobs", path: "/"},
    { text: "Start Here", id: "companies" },
    { text: "All Roadmaps", id: "career-advice", path: "/allroadmaps"},
    { text: "Interviews", id: "interview"},
    { text: "About Us", id: "about-us" },
  ];

  const profileMenuItems = [
    { text: "Profile", icon: <FiUser /> },
    { text: "Settings", icon: <FiSettings /> },
    { text: "Help Center", icon: <FiHelpCircle /> },
  ];

  return (
    <StyledAppBar position="fixed" sx={{top: 0, zIndex: 100}}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {isMobile && (
          <IconButton
            color="primary"
            edge="start"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="menu"
          >
            <FiMenu />
          </IconButton>
        )}

        <Logo
          src={logo}
          alt="Job Portal Logo"
          onClick={() => console.log("Navigate to home")}
          onError={(e) => {
            // @ts-ignore
            e.target.src =
              "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=150&h=40&fit=crop&auto=format";
          }}
        />

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {navigationItems.map((item) => (
              <NavButton key={item.id} onClick={() => navigate(item.path)}>
                <Typography variant="button" sx={{ color: "white" }}>
                  {item.text}
                </Typography>
              </NavButton>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <SearchField
            placeholder="Search ..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color="#fff"/>
                </InputAdornment>
              ),
            }}
            sx={{width: isMobile ? "150px" : "300px"}}
          />

          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "light" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          {isLoggedIn ? (
            <Tooltip title="Profile">
              <IconButton onClick={handleProfileMenuOpen} size="small">
                <Avatar
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"
                  alt="User Profile"
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Stack direction="row" spacing={0}>
              <Button
                variant="contained"
                onClick={() => navigate("/regesteration")}
                sx={{
                  backgroundColor: "#ee6c4d",
                  borderRadius: "15px",
                  width: "80px",
                  textTransform: "capitalize",
                  fontSize: "0.71rem",
                }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Box>

        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {profileMenuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={handleProfileMenuClose}
              sx={{ gap: 1 }}
            >
              {item.icon}
              <Typography>{item.text}</Typography>
            </MenuItem>
          ))}

          <MenuItem>
            <FiLogOut />
            <Typography onClick={() => {
  handleLogout();
  handleProfileMenuClose();
}}>Logout</Typography>
          </MenuItem>
        </Menu>

        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <List sx={{ width: 250 }}>
            {navigationItems.map((item) => (

              <ListItem
                button
                key={item.id}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default JobPortalHeader;
