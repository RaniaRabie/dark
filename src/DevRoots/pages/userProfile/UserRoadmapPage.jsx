import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "context/AuthContext";
import { api } from "../../../services/axiosInstance";

const RoadmapCircle = ({ roadmapName, progress, index }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        opacity: 0,
        transform: "translateY(20px)",
        animation: `fadeInUp 0.5s ease-out ${index * 0.2}s forwards`,
        "@keyframes fadeInUp": {
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "medium",
          color: theme.palette.text.primary,
          fontSize: "1.1rem",
        }}
      >
        {roadmapName}
      </Typography>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={5}
          sx={{
            color: "#ee6d4f",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "50%",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          right={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary, // #fff in dark mode
              fontWeight: "bold",
            }}
          >
            {`${progress}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const UserRoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Below 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Between 600px and 900px
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("Please log in to view your roadmaps.");
      setLoading(false);
      return;
    }

    const fetchRoadmaps = async () => {
      try {
        const response = await api.get(
          `/api/userProfile/GetUserById/${userId}`
        );
        const data = response.data;
        setRoadmaps(data.roadmaps_ || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchRoadmaps();
    }
  }, [userId]);
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
          bgcolor: theme.palette.background.default, // #121212 in dark mode
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: theme.palette.background.defult, // #121212 in dark mode
        }}
      >
        <Typography variant="h6" sx={{ color: "error.main" }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "500px", md: "500px" },
        mx: "auto",
        p: { xs: 3, sm: 4 },
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        opacity: 0,
        transform: "translateY(20px)",
        animation: "fadeInUp 0.6s ease-out forwards",
        "@keyframes fadeInUp": {
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.text.primary, // #fff in dark mode
            fontWeight: "bold",
            mb: 4,
            opacity: 0,
            transform: "translateY(-20px)",
            animation: "fadeInDown 0.5s ease-out forwards",
            "@keyframes fadeInDown": {
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
            // Responsive font size
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Your Roadmaps
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {roadmaps.length > 0 ? (
            roadmaps.slice(0, 4).map((roadmap, index) => (
              <Grid
                item
                xs={12} // Full width on mobile (stack vertically)
                sm={6} // Two items per row on tablet and desktop (2x2 grid)
                md={6} // Two items per row on desktop (2x2 grid)
                key={index}
                display="flex"
                justifyContent="center"
              >
                <RoadmapCircle
                  roadmapName={roadmap.roadmapName}
                  progress={roadmap.progress}
                  index={index}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                align="center"
                sx={{ color: theme.palette.text.primary }} // #fff in dark mode
              >
                No roadmaps available.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default UserRoadmapPage;
