/*
- File Name: TopBar.js
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT ,
  MUI ,
  react-router-dom ,
  assests,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : project header
*/


import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
  styled,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import StartIcon from "@mui/icons-material/Start";
import ServiceIcon from "@mui/icons-material/Assignment";
import InfoIcon from "@mui/icons-material/Info";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assests/devroots logo.png";
import MenuIcon from "@mui/icons-material/Menu";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#ffffff", 0.15), // Semi-transparent white background for contrast
  "&:hover": {
    backgroundColor: alpha("#ffffff", 0.25), // Slightly darker on hover
  },
  marginRight: theme.spacing(2),
  width: "200px",
  [theme.breakpoints.down("sm")]: {
    display: "none", // Hide on mobile
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff", // White color for icon to ensure visibility
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff", // White text for better contrast with dark background
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const TopBar = ({ setMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isIpad = useMediaQuery(theme.breakpoints.between("sm", "md")); // Check if the screen is iPad
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const renderMenuItems = () => (
    <>
      <MenuItem onClick={() => navigate("/")}>
        <HomeIcon fontSize="small" sx={{ mr: 1 }} />
        Home
      </MenuItem>
      <MenuItem onClick={() => navigate("/start")}>
        <StartIcon fontSize="small" sx={{ mr: 1 }} />
        Start Here
      </MenuItem>
      <MenuItem onClick={() => navigate("/service")}>
        <ServiceIcon fontSize="small" sx={{ mr: 1 }} />
        Service
      </MenuItem>
      <MenuItem onClick={() => navigate("/about")}>
        <InfoIcon fontSize="small" sx={{ mr: 1 }} />
        About Us
      </MenuItem>
    </>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#293241" }}>
      <Toolbar>
        {/* Menu items */}
        {isMobile || isIpad ? (
          <Box sx={{flexGrow: 1, display: "flex" , alignItems:"center"}}>
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {renderMenuItems()}
            </Menu>
            {/* Logo */}
            <img
              src={logo}
              alt="Logo"
              style={{width:"143px", height:"25px", marginRight: "16px" }}
            />
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 , alignItems:"center"}}>
            {/* Logo */}
            <img
              src={logo}
              alt="Logo"
              style={{width:"143px", height:"25px", marginRight: "16px" }}
            />
            {renderMenuItems()}
          </Box>
        )}

        {/* Search Box */}
        {!isMobile && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon  />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        )}

        {/* Right-side actions */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Theme toggle */}
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "light" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          {/* Login/Logout buttons */}
          {isLoggedIn ? (
            <IconButton onClick={handleLogout} color="inherit">
              <Avatar alt="User Avatar" src="#" />
              {/* Replace path as needed */}
            </IconButton>
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
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
