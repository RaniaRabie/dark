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
import SmartFooter from "./components/Footer";
import { styled } from "@mui/material/styles";
import Header from "./components/Header";

const PageContainer = styled("div")({
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
});

// Styled component for the main content
const MainContent = styled(Box)({
  flex: "1 0 auto", // This allows the content to grow while keeping footer at bottom
});

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
      <PageContainer>
        {/* <TopBar
        // @ts-ignore
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        setMode={handleToggleMode} // Pass the new function to TopBar
      /> */}

        <Header setMode={handleToggleMode}/>

        <MainContent>
          <Outlet />
        </MainContent>

        <SmartFooter />
      </PageContainer>
    </ThemeProvider>
  );
}
