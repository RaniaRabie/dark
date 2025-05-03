/*
- File Name: theme.jsx
- Author: Rania Rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies: @mui/material
- Contributors: Rania Rabie, Nourhan Khaled
- Last Modified Date: 19/4/2025
- Description: Theme configuration for light and dark mode using Material-UI
*/

import { createTheme } from "@mui/material/styles";

// Function to define design tokens based on mode
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          background: {
            header: "#1a1a1a", // Dark header
            default: "#f7f9fc", // Soft light grey
            paper: "#FFFFFF", // White for card backgrounds
          },
          text: {
            primary: "#293241", // Dark navy
            secondary: "#fff", // Muted blue
            main: "#ee6d4f"
          },
        }
      : {
          background: {
            header: "#1a1a1a", // Dark header
            default: "#121212", // Dark navy
            paper: "#1a1a1a", // Darker for paper backgrounds
          },
          text: {
            primary: "#fff", 
            secondary: "#fff", 
            main: "#ee6d4f"
          },
         
        }),
  },
});

// Create themes for light and dark modes
export const lightTheme = createTheme(getDesignTokens("light"));
export const darkTheme = createTheme(getDesignTokens("dark"));