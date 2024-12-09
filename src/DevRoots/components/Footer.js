import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon
import InfoIcon from '@mui/icons-material/Info'; // Import Info icon
import { Typography, Box, Grid } from '@mui/material';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", position: 'fixed', bottom: 0, left: 0, backgroundColor: 'white', boxShadow: 3 , height:50}}>
      <BottomNavigation
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<LocationOnIcon />}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<FolderIcon />}
        />
      </BottomNavigation>

      {/* Footer Grid */}
      <Box sx={{ p: 1 }}>
        <Grid container spacing={2} justifyContent="space-around">
          <Grid item>
            <BottomNavigationAction
              label="Home"
              icon={<HomeIcon />}
              onClick={() => console.log('Home Clicked')} // Handle navigation
            />
          </Grid>
          <Grid item>
            <BottomNavigationAction
              label="About Us"
              icon={<InfoIcon />}
              onClick={() => console.log('About Us Clicked')} // Handle navigation
            />
          </Grid>
        </Grid>
        {/* Footer Text */}
        <Box sx={{ p: 2, textAlign: 'center'  ,}}>
        <Typography variant="body2" color="text.secondary">
            Your Footer Text Here
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
