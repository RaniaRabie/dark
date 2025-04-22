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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import axios from "axios";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  const refreshAccessToken = async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) throw new Error("No refresh token found");

    try {
      const response = await axios.post(
        "https://careerguidance.runasp.net/Auth/refresh",
        { refreshToken: storedRefresh }
      );
      console.log("Refresh Token Response:", response.data);
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      return accessToken;
    } catch (refreshErr) {
      console.error("Token refresh failed:", refreshErr);
      throw refreshErr;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      // Validate ID
      if (!id) {
        setError("Invalid user ID.");
        setLoading(false);
        return;
      }

      // Fallback to location.state if available
      if (location.state) {
        setUserData(location.state);
        setLoading(false);
        return;
      }

      const getUser = async (token) => {
        return axios.get(
          `https://careerguidance.runasp.net/api/Dashboard/GetuserById/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      };

      try {
        let token = localStorage.getItem("accessToken");
        console.log("Access Token:", token);
        if (!token) throw new Error("No access token found");

        let response;
        try {
          response = await getUser(token);
        } catch (err) {
          console.error("API Error:", err.response?.data, err.response?.status);
          if (err.response?.status === 401 || err.response?.status === 403) {
            token = await refreshAccessToken();
            response = await getUser(token);
          } else if (err.response?.status === 404) {
            throw new Error("User not found.");
          } else {
            throw err;
          }
        }

        const user = response.data;
        const formattedData = {
          id: user.id,
          userName: user.userName || "N/A",
          name: user.name || "N/A",
          email: user.email || "N/A",
          role: user.role || "N/A",
          image: user.imageUrl || "N/A",
          country: user.country || "N/A",
          phoneNumber: user.phoneNumber || "N/A",
          dateOfBirth: user.dateOfBirth || "N/A",
          facebook: user.facebook || "N/A",
          github: user.github || "N/A",
          instagram: user.instagram || "N/A",
          linkedin: user.linkedin || "N/A",
        };

        setUserData(formattedData);
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.message === "User not found.") {
          setError("User not found. Redirecting...");
          setTimeout(() => navigate("/dashboard/allusers"), 3000);
        } else {
          setError("Failed to fetch user data. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, location.state, navigate]);

  const handleDeleteUser = async (id) => {
    try {
      let token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const headers = { Authorization: `Bearer ${token}` };
      let response;
      try {
        response = await axios.delete(
          `https://careerguidance.runasp.net/api/Dashboard/DeleteUser/${id}`,
          { headers }
        );
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          token = await refreshAccessToken();
          response = await axios.delete(
            `https://careerguidance.runasp.net/api/Dashboard/DeleteUser/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          throw err;
        }
      }

      setSnackbar({
        open: true,
        message: "User deleted successfully.",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard/allusers");
      }, 2000);
    } catch (err) {
      let msg = "An unknown error occurred. Please try again.";
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (
          errors.some((e) => e.message === "User.NoUsersFound") ||
          errors.some((e) => e.message === "There is no Users Right now")
        ) {
          msg = "User not found or no users to delete.";
        } else {
          msg = "An error occurred while deleting.";
        }
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        msg = "Session expired. Please login again.";
      }

      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleConfirmDelete = () => {
    handleDeleteUser(userData.id);
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
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            backgroundColor: "gray",
            fontSize: "2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {userData?.name?.[0]?.toUpperCase()}
        </Avatar>
      </Box>

      <Section title="Information">
        <CardContentGrid
          data={[
            { label: "Username:", field: "name" },
            { label: "Name:", field: "userName" },
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
                  <FacebookIcon
                    style={{
                      color: "#3b5998",
                      marginBottom: "3px",
                      marginRight: "5px",
                    }}
                  />
                  Facebook:
                </span>
              ),
              field: "facebook",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <GitHubIcon
                    style={{
                      color: "#000000",
                      marginBottom: "3px",
                      marginRight: "5px",
                    }}
                  />
                  GitHub:
                </span>
              ),
              field: "github",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <InstagramIcon
                    style={{
                      color: "#C13584",
                      marginBottom: "3px",
                      marginRight: "5px",
                    }}
                  />
                  Instagram:
                </span>
              ),
              field: "instagram",
            },
            {
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <LinkedInIcon
                    style={{
                      color: "#0077b5",
                      marginBottom: "3px",
                      marginRight: "5px",
                    }}
                  />
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
                {userData[field] || "N/A"}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
