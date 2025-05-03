// /*
// - File Name: AboutUs.jsx
// - Author: Nourhan Khaled
// - Date of Creation: 25/04/2025
// - Versions Information: 1.0.0
// - Dependencies:
//   {
//     React,
//     @mui/material,
//     @mui/material/styles
//   }
// - Contributors:
// - Last Modified Date: 01/05/2025
// - Description: About page component with enhanced design, featuring an engaging About section and a team grid with modern card designs
// */

// export default AboutUs;
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Link,
  Fade,
  Grow,
  useTheme,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LinkedIn, GitHub } from "@mui/icons-material";
import { useAuth } from "context/AuthContext";
import {api} from "../../../services/axiosInstance"


// Root container with subtle gradient
const Root = styled(Box)(({ theme }) => ({
  background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
  padding: theme.spacing(14, 0, 6),
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(8, 0, 4),
  },
}));

// Hero section with elegant styling
const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(5),
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0 2px 6px rgba(0,0,0,${
    theme.palette.mode === "dark" ? 0.3 : 0.1
  })`,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

// Styled paper for team cards, inspired by original design
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: "transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
  boxShadow: `0 2px 4px rgba(0,0,0,${
    theme.palette.mode === "dark" ? 0.3 : 0.1
  })`,
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: `0 6px 12px rgba(0,0,0,${
      theme.palette.mode === "dark" ? 0.4 : 0.15
    })`,
    border: `2px solid ${theme.palette.text.main || "#FF8E6E"}`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

// Avatar placeholder with vibrant color
const AvatarPlaceholder = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: theme.palette.text.main || "#ee6d4f",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontWeight: "bold",
  fontSize: "1.8rem",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

// Role badge with subtle styling
const RoleBadge = styled(Box)(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(1),
  background: `${theme.palette.text.main || "#ee6d4f"}20`,
  color: theme.palette.text.main || "#ee6d4f",
  fontSize: "0.85rem",
  fontWeight: "medium",
  marginBottom: theme.spacing(1.5),
}));

// Social icon with ripple effect
const SocialIcon = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: theme.spacing(0, 1),
  position: "relative",
  overflow: "hidden",
  borderRadius: "50%",
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    color: theme.palette.text.main || "#ee6d4f",
    transform: "scale(1.15)",
  },
  "&:before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    background: `${theme.palette.text.main || "#ee6d4f"}30`,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    transition: "width 0.4s ease, height 0.4s ease",
  },
  "&:hover:before": {
    width: "200%",
    height: "200%",
  },
}));

// CTA button with dark orange gradient
const CTAButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg,  #ee6d4f, #1a1a1a)",
  color: theme.palette.common.white,
  padding: theme.spacing(1.2, 4),
  borderRadius: theme.spacing(1),
  textTransform: "none",
  fontWeight: "medium",
  fontSize: "1rem",
  boxShadow: `0 2px 6px rgba(0,0,0,${
    theme.palette.mode === "dark" ? 0.3 : 0.1
  })`,
  transition: "transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    background: "linear-gradient(135deg, #ee6d4f, #1a1a1a)",
    boxShadow: `0 4px 10px rgba(0,0,0,${
      theme.palette.mode === "dark" ? 0.4 : 0.15
    })`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 3),
  },
}));

const AboutUs = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const [teamMembers, setTeamMembers] = useState([
    {
      name: "Kareem Mangood",
      email: "kareem.mangood.cg@gmail.com",
      role: "Project Manager",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Mohamed Khaled Abdeltawab",
      email: "mohamed.khaled.cg@gmail.com",
      role: "Lead Developer",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Abdelrahman Rezq Mohamed",
      email: "abdelrahman.rezq.cg@gmail.com",
      role: "Data Analyst",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Abdelrahman Maged",
      email: "abdelrahman.maged.cg@gmail.com",
      role: "Backend Engineer",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Nourhan Khaled Shipa",
      email: "nourhan.khaled.cg@gmail.com",
      role: "Frontend Engineer",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Rania Rabie Sayed",
      email: "rania.rabie.cg@gmail.com",
      role: "Frontend Engineer",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Shrouk Ahmed Rashad",
      email: "shrouk.ahmed.cg@gmail.com",
      role: "Frontend Engineer",
      gitHub: "",
      linkedIn: "",
    },
    {
      name: "Ziad Elamir Mohamed",
      email: "ziad.elamir.cg@gmail.com",
      role: "UI/UX Designer",
      gitHub: "",
      linkedIn: "",
    },
  ]);

  // Fetch social media links for team members
  useEffect(() => {
    const fetchTeamSocialLinks = async () => {
      if (!user?.token) return;

      try {
        // Assuming we have a way to map emails to user IDs or fetch all team members
        // For simplicity, we'll simulate fetching data for each member
        const updatedMembers = await Promise.all(
          teamMembers.map(async (member) => {
            try {
              // Here, we assume we have an endpoint to get user by email
              const res = await api.get(
                `/api/userProfile/GetUserByEmail/${member.email}`,
              );
              const userData = res.data;
              return {
                ...member,
                gitHub: userData.gitHub || "",
                linkedIn: userData.linkedIn || "",
              };
            } catch (err) {
              console.error(`Error fetching data for ${member.email}:`, err);
              return member; // Return unchanged member if fetch fails
            }
          })
        );
        setTeamMembers(updatedMembers);
      } catch (err) {
        console.error("Error fetching team social links:", err);
      }
    };

    fetchTeamSocialLinks();
  }, [teamMembers, user?.token]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Root>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={800}>
          <HeroSection>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                animation: "fadeInUp 1s ease-out",
                "@keyframes fadeInUp": {
                  "0%": { transform: "translateY(20px)", opacity: 0 },
                  "100%": { transform: "translateY(0)", opacity: 1 },
                },
                [theme.breakpoints.down("sm")]: { fontSize: "2rem" },
              }}
            >
              Welcome to Devroots
            </Typography>
            <Divider
              sx={{
                width: "80px",
                height: "3px",
                background: theme.palette.text.main || "#ee6d4f",
                margin: "20px auto",
                borderRadius: "2px",
              }}
            />
            <Typography
              variant="h5"
              color={theme.palette.text.primary}
              sx={{ mb: 3, fontWeight: "medium" }}
            >
              Empowering Your Tech Journey
            </Typography>
            <Typography
              variant="body1"
              color={theme.palette.text.primary}
              sx={{ maxWidth: "800px", mx: "auto", lineHeight: 1.8, mb: 4 }}
            >
              Devroots is a cutting-edge career guidance platform designed to
              empower students, developers, and professionals in shaping their
              tech careers. Our mission is to bridge the gap between ambition
              and achievement by offering interactive, personalized roadmaps
              tailored to your unique skills, goals, and the latest industry
              trends. Whether you're a beginner taking your first steps or a
              seasoned professional seeking to advance, Devroots provides clear,
              actionable pathways to success. With foundational knowledge,
              expert insights, a vibrant community, and innovative tools, we’re
              here to make your learning journey seamless, inspiring, and
              transformative. Join us at Devroots and unlock your full potential
              in the ever-evolving world of technology.
            </Typography>
            <CTAButton href="/allroadmaps">Explore Our Roadmaps</CTAButton>
          </HeroSection>
        </Fade>

        {/* Team Section */}
        <Box sx={{ mt: 8 }}>
          <Fade in timeout={1000}>
            <Box>
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  [theme.breakpoints.down("sm")]: { fontSize: "2rem" },
                }}
              >
                Meet Our Team
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  height: "3px",
                  background: theme.palette.text.main || "#ee6d4f",
                  margin: "20px auto",
                  borderRadius: "2px",
                }}
              />
              <Typography
                variant="body1"
                color={theme.palette.text.primary}
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 6,
                  textAlign: "center",
                }}
              >
                Our dedicated team of innovators and educators is committed to
                guiding you every step of the way.
              </Typography>
              <Grid container spacing={3}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Grow in timeout={1200 + index * 150}>
                      <StyledPaper>
                        <AvatarPlaceholder>
                          {getInitials(member.name)}
                        </AvatarPlaceholder>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
                          }}
                        >
                          {member.name}
                        </Typography>
                        <RoleBadge>{member.role}</RoleBadge>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          <Link
                            href={`mailto:${member.email}`}
                            sx={{
                              color: theme.palette.text.primary,
                              textDecoration: "none",
                              "&:hover": {
                                color: theme.palette.text.main || "#ee6d4f",
                              },
                            }}
                          >
                            {member.email}
                          </Link>
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <SocialIcon
                            href={member.linkedIn || "#"}
                            target="_blank"
                            rel="noopener"
                          >
                            <LinkedIn fontSize="small" />
                          </SocialIcon>
                          <SocialIcon
                            href={member.gitHub || "#"}
                            target="_blank"
                            rel="noopener"
                          >
                            <GitHub fontSize="small" />
                          </SocialIcon>
                        </Box>
                      </StyledPaper>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Root>
  );
};

export default AboutUs;
