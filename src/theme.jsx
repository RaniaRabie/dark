// /*
// - File Name:theme.jsx
// - Author: rania rabie
// - Date of Creation: 17/9/2024
// - Versions Information: 1.0.0
// - Dependencies: modes
// - Contributors: rania rabie , nourhan khaled
// - Last Modified Date: 1/11/2024
// - Description : Dark mode
// */
// import { createTheme } from "@mui/material/styles";
// export const getDesignTokens = (mode) => ({});

// export const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//     background: {
//       // @ts-ignore
//       header:"#1a1a1a",
//       default: "#f7f9fc", // soft  Light grey
//       paper: "#FFFFFF", // White for card backgrounds
//       // secondary: '#3d5a80', // Muted blue
//     },
//     text: {
//       primary: "#293241", // Dark navy
//       secondary: "#3d5a80", // Muted blue
//     },
//     // @ts-ignore
    
//       //buttons, links, or important highlights
//       main: "#ee6c4d", // Coral
//       hover: "#ee5c3d", // Soft blue
    

//     divider: "#98c1d9", // Soft blue for borders and dividers
//   },
// });

// export const darkTheme = createTheme({
//   palette: {
//     mode: "dark",

//     background: {
    
//       default: "#121212", // Dark navy
//       paper:"#1a1a1a" , // Muted blue for paper backgrounds
//     },
//     text: {
//       primary: "#e0fbfc", // Light aqua
//       secondary: "#98c1d9", // Soft blue
//     },
//     primary: {
//       main: "#ee6c4d", // Coral
//     },
//     secondary: {
//       main: "#3d5a80", // Muted blue
//     },
//     divider: "#98c1d9", // Soft blue for borders and dividers
//   },
// });







































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
            primary: "#fff", // Light aqua
            secondary: "#fff", // Soft blue
            main: "#ee6d4f"
          },
         
        }),
  },
});

// Create themes for light and dark modes
export const lightTheme = createTheme(getDesignTokens("light"));
export const darkTheme = createTheme(getDesignTokens("dark"));