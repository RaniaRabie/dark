/*
- File Name: DashboardOutlet.jsx
- Author: rania rabie
- Date of Creation: 25/10/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  }
- Contributors:shrouk ahmed, rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : rendering main outlet for dashboard
*/
import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import SideBar from "./components/SideBar";
import { useMemo, useState } from "react";
import { darkTheme, lightTheme } from "theme";

export default function DashboardOutlet() {
  const [open, setOpen] = useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Set initial mode based on local storage or default to "light"
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("currentMode");
    return savedMode ? savedMode : "light";
  });

  // Toggle the mode and save it to local storage
  const handleToggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("currentMode", newMode);
  };

  // Create the theme based on the current mode
  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  return (
    <Box sx={{ display: { xs: "block", lg: "flex" } }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Pass the correct mode and toggleMode function to TopBar */}
        <TopBar open={open} mode={mode} toggleMode={handleToggleMode} />

        <SideBar open={open} handleDrawerClose={handleDrawerClose} />

        <Box
          component="main"
          sx={{
            flexGrow: { xs: 0, lg: 1 },
            mt: { lg: "45px" },
            ml: { xs: "45px", lg: "0px" },
          }}
        >
          <Outlet />
        </Box>
      </ThemeProvider>
    </Box>
  );
}
