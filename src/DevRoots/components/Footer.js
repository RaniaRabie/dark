import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const StyledFooter = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #1a1a1a 45%, #ee6d4f 100%)"
      : "linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)",
  padding: theme.spacing(6, 0),
  color: theme.palette.mode === "dark" ? "#fff" : "#333",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  flexShrink: 0, // Prevents footer from shrinking
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "#333",
  textDecoration: "none",
  transition: "color 0.2s ease",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: 0,
    width: 0,
    height: "2px",
    background: "#7c4dff",
    transition: "width 0.3s ease",
  },
  "&:hover::after": {
    width: "100%",
  },
  "&:hover": {
    color: "#7c4dff",
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateX(5px)",
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  color: theme.palette.mode === "dark" ? "#fff" : "#333",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    color: "#7c4dff",
  },
  "&:focus": {
    outline: "2px solid #7c4dff",
    outlineOffset: "2px",
  },
}));

const SmartFooter = () => {
  const theme = useTheme();

  return (
    <Box sx={{position:"relative"}}>
      <StyledFooter>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We are dedicated to providing innovative solutions and exceptional
                services to our valued customers worldwide.
              </Typography>
            </Grid>
      
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/startHere">Start here</FooterLink>
                <FooterLink to="/allRoadmaps">All Roadmaps</FooterLink>
                <FooterLink to="#">Interviews</FooterLink>
                <FooterLink to="#">About US</FooterLink>
              </Box>
            </Grid>
      
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Contact Info
              </Typography>
              <ContactItem>
                <MdLocationOn style={{ marginRight: "8px" }} />
                <Typography variant="body2">
                  123 Business Street, NY 10001
                </Typography>
              </ContactItem>
              <ContactItem>
                <MdPhone style={{ marginRight: "8px" }} />
                <Typography variant="body2">+1 234 567 8900</Typography>
              </ContactItem>
              <ContactItem>
                <MdEmail style={{ marginRight: "8px" }} />
                <Typography variant="body2">contact@example.com</Typography>
              </ContactItem>
            </Grid>
      
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Follow Us
              </Typography>
              <Box>
                <Tooltip title="Facebook" arrow>
                  <SocialButton aria-label="facebook">
                    <FaFacebook />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="Twitter" arrow>
                  <SocialButton aria-label="twitter">
                    <FaTwitter />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="Instagram" arrow>
                  <SocialButton aria-label="instagram">
                    <FaInstagram />
                  </SocialButton>
                </Tooltip>
                <Tooltip title="LinkedIn" arrow>
                  <SocialButton aria-label="linkedin">
                    <FaLinkedin />
                  </SocialButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
      
          <Box
            sx={{
              mt: 4,
              pt: 2,
              borderTop: "1px solid",
              borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} DevRoots. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </StyledFooter>
    </Box>
  );
};

export default SmartFooter;