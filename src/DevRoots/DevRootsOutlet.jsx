/*
- File Name: DevRootsOutlet.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  }
- Contributors:shrouk ahmed, rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : rendering main outlet for dashboard
*/
import React, { useMemo, useState } from "react";
import TopBar from "./components/TopBar";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "../theme";
export default function DevRootsOutlet() {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Set initial mode based on local storage or default to "light"
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("currentMode");
    return savedMode ? savedMode : "light";
  });

  // Save the mode to local storage whenever it changes
  const handleToggleMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem("currentMode", newMode);
  };

  // Create the theme based on the current mode
  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        setMode={handleToggleMode} // Pass the new function to TopBar
      />
      <Box sx={{mt:"64px"}}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}
