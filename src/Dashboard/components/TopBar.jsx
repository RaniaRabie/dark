/*
- File Name: App.js
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  react-router-dom ,
  SideBar file
  }
- Contributors: shrouk ahmed,Nourhan khaled, rania rabie
- Last Modified Date: 1/11/2024
- Description : 
*/

import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  AppBar as MuiAppBar,
  styled,
  useTheme,
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ open, toggleMode, mode }) => {
  const theme = useTheme()
  return (
    <AppBar
      position="fixed"
      // @ts-ignore
      open={open}
      sx={{
        height: "45px",
        background: "#1d242f !important", // Replace with your desired static color
        boxShadow: "none"      }}
    >
      <Toolbar sx={{ minHeight: { xs: 0, sm: 0 } }}>
        <Box flexGrow="1" />
        <Stack direction="row" spacing={1}>



          {/* Dark mode toggle button */}
          <IconButton onClick={toggleMode} color="inherit">
            {mode === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>



          <IconButton color="inherit">
            <NotificationsNoneOutlinedIcon />
          </IconButton>

          {/* Profile icon */}
          <IconButton color="inherit">
            <Person2OutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
