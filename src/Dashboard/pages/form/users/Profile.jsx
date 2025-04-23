import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  Button,
  useTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import axios from "axios";
import { useAuth } from "context/AuthContext";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();
  const {token} = useAuth()


  // Helper to format ISO date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date) || date.getFullYear() < 1000) return null; // لو التاريخ أقل من سنة 1000، نرجع null
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) throw new Error("No access token found");

        // Use apiClient for the API call, which handles token refresh
        const response = await axios.get(
          `https://careerguidance.runasp.net/api/Dashboard/GetuserById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const u = response.data;
        setUserData({
          id: u.id || id,
          userName: u.userName || "null",
          name: u.name || "null",
          email: u.email || "null",
          role: u.role || "null",
          image: u.imageUrl || "null",
          country: u.country || "null",
          phoneNumber: u.phoneNumber || "null",
          dateOfBirth: formatDate(u.dateOfBirth),
          facebook: u.facebook || "null",
          github: u.github || "null",
          instagram: u.instagram || "null",
          linkedin: u.linkedin || "null",
          frontendRoadmap: u.frontendRoadmap || "null",
          backendRoadmap: u.backendRoadmap || "null",
        });
      } catch (err) {
        if (err.response?.status === 404) {
          setError("User not found. Redirecting...");
          setTimeout(() => navigate("/dashboard/allusers"), 3000);
        } else {
          setError(err.message || "Failed to fetch user data. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate, token]); // Add token as a dependency

  const handleDeleteUser = async () => {
    try {
      if (!token) throw new Error("No authentication token found");

      // Use apiClient for the delete request
      await axios.delete(
        `https://careerguidance.runasp.net/api/Dashboard/DeleteUser/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: "User deleted successfully.",
        severity: "success",
      });
      setTimeout(() => navigate("/dashboard/allusers"), 2000);
    } catch (err) {
      let msg = "An unknown error occurred. Please try again.";
      if (err.response?.data?.errors) {
        msg = err.response.data.errors.map((e) => e.message).join(", ");
      } else if (err.message === "No authentication token found") {
        msg = "Session expired. Please login again.";
      }

      setSnackbar({ open: true, message: msg, severity: "error" });
      console.error(err);
    }
  };

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleConfirmDelete = () => {
    handleDeleteUser();
    handleCloseConfirm();
  };
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((s) => ({ ...s, open: false }));
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading user...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/dashboard/allusers")}
        >
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: theme.palette.text.primary,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Profile
      </Typography>
      <Box textAlign="center" mb={4}>
        <Avatar
        src={userData.image}
        alt={userData.userName[0].toUpperCase()}

          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            backgroundColor: "gray",
            fontSize: "2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >

        </Avatar>
        
      </Box>
      <Section title="Information">
        <CardContentGrid
          data={[
            { label: "Username:", field: "userName" },
            { label: "Name:", field: "name" },
            { label: "Role:", field: "role" },
          ]}
          userData={userData}
        />
      </Section>
      <Section title="Communication">
        <CardContentGrid
          data={[
            { label: "Email:", field: "email" },
            { label: "Country:", field: "country" },
            { label: "Phone Number:", field: "phoneNumber" },
            { label: "Date of Birth:", field: "dateOfBirth" },
          ]}
          userData={userData}
        />
      </Section>
      <Section title="Social Media">
        <CardContentGrid
          data={[
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FacebookIcon style={{ color: "#3b5998", marginRight: 5 }} />
                  Facebook:
                </span>
              ),
              field: "facebook",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <GitHubIcon style={{ color: "#000", marginRight: 5 }} />
                  GitHub:
                </span>
              ),
              field: "github",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <InstagramIcon style={{ color: "#C13584", marginRight: 5 }} />
                  Instagram:
                </span>
              ),
              field: "instagram",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LinkedInIcon style={{ color: "#0077b5", marginRight: 5 }} />
                  LinkedIn:
                </span>
              ),
              field: "linkedin",
            },
          ]}
          userData={userData}
        />
      </Section>
      <Section title="Roadmaps">
        <CardContentGrid
          data={[
            { label: "Frontend:", field: "frontendRoadmap" },
            { label: "Backend:", field: "backendRoadmap" },
          ]}
          userData={userData}
        />
      </Section>
      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          sx={{
            padding: "10px 20px",
            width: "200px",
            borderRadius: "20px",
            backgroundColor: "#ee6c4d",
            textTransform: "capitalize",
            color: "#fff",
            "&:hover": { backgroundColor: "#d95b38" },
          }}
          onClick={handleOpenConfirm}
        >
          Delete User
        </Button>
      </Box>
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function Section({ title, children }) {
  const theme = useTheme();
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#ee6c4d",
          position: "absolute",
          mt: -2,
          marginLeft: 15,
        }}
      >
        {title}
      </Typography>
      <Card
        sx={{
          border: "2px solid gray",
          borderTop: "none",
          borderRadius: "12px",
          p: 4,
          width: "80%",
          margin: "auto",
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 1px 10px rgba(0, 0, 1, 0.1)",
          mb: 4,
        }}
      >
        {children}
      </Card>
    </>
  );
}

function CardContentGrid({ data, userData }) {
  const theme = useTheme();
  return (
    <Box>
      <Grid container spacing={2}>
        {data.map(({ label, field }, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  marginRight: "10px",
                }}
              >
                {label}
              </Typography>
              <Typography
                sx={{ fontSize: "1rem", fontWeight: "500", color: "gray" }}
              >
                {userData[field] || "null"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
