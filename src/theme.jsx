/*
- File Name:theme.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies: modes
- Contributors: rania rabie , nourhan khaled
- Last Modified Date: 1/11/2024
- Description : Dark mode
*/
import { createTheme } from "@mui/material/styles";
export const getDesignTokens = (mode) => ({});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      // @ts-ignore
      header:"#1a1a1a",
      default: "#f7f9fc", // soft  Light grey
      paper: "#FFFFFF", // White for card backgrounds
      // secondary: '#3d5a80', // Muted blue
    },
    text: {
      primary: "#293241", // Dark navy
      secondary: "#3d5a80", // Muted blue
    },
    // @ts-ignore
    
      //buttons, links, or important highlights
      main: "#ee6c4d", // Coral
      hover: "#ee5c3d", // Soft blue
    

    divider: "#98c1d9", // Soft blue for borders and dividers
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    background: {
    
      default: "#121212", // Dark navy
      paper:"#1a1a1a" , // Muted blue for paper backgrounds
    },
    text: {
      primary: "#e0fbfc", // Light aqua
      secondary: "#98c1d9", // Soft blue
    },
    primary: {
      main: "#ee6c4d", // Coral
    },
    secondary: {
      main: "#3d5a80", // Muted blue
    },
    divider: "#98c1d9", // Soft blue for borders and dividers
  },
});
