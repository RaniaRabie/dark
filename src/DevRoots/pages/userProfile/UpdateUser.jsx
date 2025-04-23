import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
  InputAdornment,
  OutlinedInput,
  useMediaQuery,
} from "@mui/material";
import Settingg from "./Settingg";
import SocialMedia from "./SocialMedia";
import { Edit as EditIcon } from "@mui/icons-material";
import axios from "axios";
import SideBar from "./SideBar_user";
import { useAuth } from "context/AuthContext";
import {
  Person as PersonIcon,
  Public as PublicIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

function UpdateUser() {
  const [tab, setTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    country: "",
    phoneNumber: "",
    dateOfBirth: "",
    imageUrl: "",
  });

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const [editField, setEditField] = useState(null);
  const [editStates, setEditStates] = useState({
    name: false,
    country: false,
    phoneNumber: false,
    dateOfBirth: false,
    imageUrl: false,
    all: false,
  });
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const governorates = ["Egypt"];
  const theme = useTheme();
  //  Detect screen size
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <= 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 1024px
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Sidebar open by default on non-mobile

  const isoDate = userInfo.dateOfBirth;
  const { userId } = useAuth();
  useEffect(() => {
    axios
      .get(
        `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`
      )
      .then((response) => {
        const data = response.data || {};
        setUserInfo({
          ...data,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setSnackbarMessage(" Failed to load user data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, [userId]);

  // Name validation
  const validateName = (name) => {
    const cleaned = name.trim();
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces

    if (!cleaned) return "Name is required.";
    if (cleaned.length < 3) return "Name must be at least 3 characters long.";
    if (cleaned.length > 30) return "Name must be less than 30 characters.";
    if (cleaned.match(/\d/)) return "Name cannot contain numbers.";
    if (!nameRegex.test(cleaned))
      return "Name cannot contain special characters.";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    if (name === "name") {
      setNameError(validateName(value));
    }
  };

  const toggleEdit = (field) => {
    if (field === "all") {
      setEditStates((prev) => {
        const newState = !prev.all;
        return {
          name: newState,
          country: newState,
          phoneNumber: newState,
          dateOfBirth: newState,
          imageUrl: newState,
          all: newState,
        };
      });
    } else {
      setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  // Format DOB for display
  const formatDOBForDisplay = (isoDate) => {
    if (!isoDate || isoDate.startsWith("0001")) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // Handle DOB input
  const handleDOBChange = (e) => {
    const value = e.target.value;
    setUserInfo((prev) => ({
      ...prev,
      dateOfBirth: value,
    }));
  };

  const handlePhoneInput = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    const validPrefixes = ["010", "011", "012", "015"];
    const isValidPrefix = validPrefixes.some((prefix) =>
      input.startsWith(prefix)
    );
    if (isValidPrefix && input.length === 11) {
      input = `+20${input.substring(1)}`;
      setUserInfo((prev) => ({ ...prev, phoneNumber: input }));
      setPhoneError("");
    } else {
      setPhoneError(
        "Phone number must start with 010, 011, 012, or 015 and be followed by 8 digits"
      );
      setUserInfo((prev) => ({ ...prev, phoneNumber: e.target.value }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleSave = async () => {
    try {
      // Validate required fields
      if (!userInfo.name) {
        setNameError("Name is required.");
        setSnackbarMessage("Name is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      if (!userInfo.phoneNumber) {
        setPhoneError("Phone number is required.");
        setSnackbarMessage("Phone number is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      if (!userInfo.dateOfBirth) {
        setSnackbarMessage("Date of birth is required.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Validate name
      const nameValidationError = validateName(userInfo.name);
      if (nameValidationError) {
        setNameError(nameValidationError);
        setSnackbarMessage(nameValidationError);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Validate phone
      if (phoneError) {
        setSnackbarMessage("Please correct phone number before saving");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Validate date of birth (age between 9 and 55)
      const dob = new Date(userInfo.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      if (age < 9 || age > 55) {
        setSnackbarMessage("Age must be between 9 and 55 years.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Validate image URL
      if (userInfo.imageUrl && !userInfo.imageUrl.startsWith("https://")) {
        setSnackbarMessage("Image URL must start with https://");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const token = localStorage.getItem("accessToken");

      const updatedData = {
        name: userInfo.name || "",
        country: userInfo.country || "",
        phoneNumber: userInfo.phoneNumber || null,
        dateOfBirth: userInfo.dateOfBirth
          ? new Date(userInfo.dateOfBirth).toISOString()
          : new Date("2000-01-01").toISOString(),
        imageUrl: userInfo.imageUrl || "",
      };

      await axios.put(
        `https://careerguidance.runasp.net/api/userProfile/UpdateProfile/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setEditField(null);
      setEditStates({
        name: false,
        country: false,
        phoneNumber: false,
        dateOfBirth: false,
        imageUrl: null,
        all: false,
      });
    } catch (error) {
      console.error("Error updating profile", error);
      const messages = [];

      if (error.response && error.response.data?.errors) {
        const backendErrors = error.response.data.errors;
        if (Array.isArray(backendErrors)) {
          messages.push(backendErrors[1] || backendErrors[0]);
        } else if (typeof backendErrors === "object") {
          const firstKey = Object.keys(backendErrors)[0];
          const firstError = backendErrors[firstKey]?.[0];
          if (firstError) {
            messages.push(firstError);
          }
        }
      }

      if (userInfo.imageUrl && !userInfo.imageUrl.startsWith("https://")) {
        messages.push("Image URL must start with https://");
      }

      if (messages.length === 0) {
        messages.push("An unexpected error occurred.");
      }

      setSnackbarMessage(messages[0]);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const inputStyleFull = {
    width: { xs: "100%", sm: "90%", md: "85%", lg: "100%" },
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      height: "45px",
      paddingRight: 1,
      backgroundColor: "transparent",
      "& fieldset": { border: "1px solid #ee6c4d" },
      "&:hover fieldset": { borderColor: "#ee6c4d" },
      "&.Mui-focused fieldset": { borderColor: "#ee6c4d" },
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 10px transparent inset",
      backgroundColor: "transparent",
      WebkitTextFillColor: theme.palette.text.primary,
      transition: "background-color 5000s ease-in-out 0s",
    },
    "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
      backgroundColor: "transparent",
      WebkitBoxShadow: "0 0 0 10px transparent inset",
      transition: "background-color 5000s ease-in-out 0s",
    },
  };

  const adornmentProps = (icon) => ({
    startAdornment: (
      <InputAdornment position="start">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {React.cloneElement(icon, {
            style: {
              color: "#ee6c4d",
              fontSize: 25,
              ...icon.props?.style,
            },
          })}
          <div
            style={{
              height: "30px",
              width: "2px",
              backgroundColor: "#ee6c4d",
              marginLeft: "8px",
              marginRight: "4px",
              borderRadius: "1px",
            }}
          />
        </div>
      </InputAdornment>
    ),
  });
  const sidebarWidth = isSidebarOpen ? (isMobile ? 240 : 300) : 64;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Box sx={{ flexShrink: 0 }}>
        <SideBar tab={tab} setTab={setTab} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          // ml: { xs: `${sidebarWidth}px`, sm: `${sidebarWidth}px` },
          p: { xs: 1, sm: 2, md: 3 },
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "margin-left 0.3s ease",
        }}
      >
        {tab === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              marginTop: "50px",
              justifyContent: "center",
              width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
              transition: "all 0.3s ease",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                // p: 4,
                p: { xs: 2, sm: 3, md: 4 },
                width: { xs: "100%", sm: "95%", md: "90%", lg: "60%" },
                maxWidth: { xs: "100%", sm: 550, md: 600, lg: 650 },
                minWidth: { xs: "90%", sm: "80%", md: "60%" },
                // width: "60%",
                // maxWidth: editStates.all ? "600px" : "400px",
                // minWidth: { xs: "90%", sm: "80%", md: "60%" },
                transition: "all 0.3s ease-in-out",
                margin: "0 auto",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {/* العنوان + زر التعديل */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: { xs: 20, sm: 24, md: 28, lg: 35 },
                    // fontSize: "35px",
                    fontWeight: "bold",
                    textShadow: "1px 1px 1px #b5adad",
                  }}
                >
                  User Profile
                </Typography>
                <IconButton onClick={() => toggleEdit("all")}>
                  <EditIcon
                    sx={{
                      color: "#ee6c4d",
                      fontSize: { xs: 26, sm: 28, md: 35 },
                      // fontSize: "35px",
                      fontWeight: "bold",
                      textShadow: "1px 1px 1px #b5adad",
                    }}
                  />
                </IconButton>
              </Box>

              {/* EDIT FIELDS*/}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* IMAGE */}
                {userInfo.imageUrl && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Avatar
                      src={userInfo.imageUrl}
                      alt="Profile"
                      sx={{
                        width: { xs: 70, sm: 90, md: 100, lg: 120 },
                        height: { xs: 70, sm: 90, md: 100, lg: 120 },
                        // width: 120,
                        // height: 120,
                        border: "2px solid #ee6c4d",
                      }}
                    />
                  </Box>
                )}

                {/* IMAGE URL */}
                {editStates.all && (
                  <Tooltip
                    title={
                      userInfo.imageUrl &&
                      !userInfo.imageUrl.startsWith("https://")
                        ? "Image URL must start with https://"
                        : ""
                    }
                    open={
                      userInfo.imageUrl &&
                      !userInfo.imageUrl.startsWith("https://")
                    }
                    placement={
                      isMobile ? "bottom" : isTablet ? "top" : "right-start"
                    }
                    arrow
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          backgroundColor: "#f5f5f5",
                          color: "#ee6c4d",
                          fontSize: isMobile ? "12px" : "13px",
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                        "& .MuiTooltip-arrow": {
                          color: "#f5f5f5",
                        },
                      },
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: isMobile
                              ? [0, 8]
                              : isTablet
                              ? [0, 10]
                              : [10, -5],
                          },
                        },
                      ],
                    }}
                  >
                    <TextField
                      label="Image URL"
                      placeholder="Enter image URL (https://...)"
                      name="imageUrl"
                      value={userInfo.imageUrl || ""}
                      onChange={handleInputChange}
                      fullWidth
                      onKeyDown={handleKeyPress}
                      InputProps={adornmentProps(<ImageIcon />)}
                      sx={inputStyleFull}
                      error={
                        userInfo.imageUrl &&
                        !userInfo.imageUrl.startsWith("https://")
                      }
                    />
                  </Tooltip>
                )}

                {/* NAME */}
                {editStates.all ? (
                  <Tooltip
                    title={nameError || ""}
                    open={!!nameError}
                    placement={
                      isMobile ? "bottom" : isTablet ? "top" : "right-start"
                    }
                    arrow
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          backgroundColor: "#f5f5f5",
                          color: "#ee6c4d",
                          fontSize: isMobile ? "12px" : "13px",
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                        "& .MuiTooltip-arrow": {
                          color: "#f5f5f5",
                        },
                      },
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: isMobile
                              ? [0, 8]
                              : isTablet
                              ? [0, 10]
                              : [10, -5],
                          },
                        },
                      ],
                    }}
                  >
                    <TextField
                      label="Name *"
                      placeholder="Enter your full name"
                      name="name"
                      value={userInfo.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUserInfo((prev) => ({ ...prev, name: value }));
                        setNameError(validateName(value));
                      }}
                      fullWidth
                      onKeyDown={handleKeyPress}
                      margin="normal"
                      error={!!nameError}
                      InputProps={adornmentProps(<PersonIcon />)}
                      sx={inputStyleFull}
                      required
                    />
                  </Tooltip>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{  width: "100%" }}
                  >
                    <strong>Name:</strong> {userInfo.name}
                  </Typography>
                )}

                {/* COUNTRY */}
                {editStates.all ? (
                  <TextField
                    select
                    label="Country"
                    placeholder="Select your country"
                    name="country"
                    value={userInfo.country || ""}
                    onChange={handleInputChange}
                    fullWidth
                    onKeyDown={handleKeyPress}
                    InputProps={adornmentProps(<PublicIcon />)}
                    sx={inputStyleFull}
                  >
                    {governorates.map((gov) => (
                      <MenuItem key={gov} value={gov}>
                        {gov}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{width: "100%" }}
                  >
                    <strong>Country:</strong> {userInfo.country}
                  </Typography>
                )}

                {/* PHONE */}
                {editStates.all ? (
                  <Tooltip
                    title={phoneError || ""}
                    open={!!phoneError}
                    placement={
                      isMobile ? "bottom" : isTablet ? "top" : "right-start"
                    }
                    arrow
                    PopperProps={{
                      sx: {
                        "& .MuiTooltip-tooltip": {
                          backgroundColor: "#f5f5f5",
                          color: "#ee6c4d",
                          fontSize: isMobile ? "12px" : "13px",
                          fontWeight: "bold",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                        "& .MuiTooltip-arrow": {
                          color: "#f5f5f5",
                        },
                      },
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: isMobile
                              ? [0, 8]
                              : isTablet
                              ? [0, 10]
                              : [10, -5],
                          },
                        },
                      ],
                    }}
                  >
                    <TextField
                      label="Phone Number *"
                      placeholder="Enter phone number (e.g., 01234567890)"
                      name="phone"
                      value={userInfo.phoneNumber || ""}
                      onChange={handlePhoneInput}
                      fullWidth
                      onKeyDown={handleKeyPress}
                      error={!!phoneError}
                      InputProps={adornmentProps(<PhoneIcon />)}
                      sx={inputStyleFull}
                      required
                    />
                  </Tooltip>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{  width: "100%" }}
                  >
                    <strong>Phone:</strong> {userInfo.phoneNumber}
                  </Typography>
                )}

                {/* DOB */}
                {editStates.all ? (
                  <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                    <FormControl fullWidth sx={inputStyleFull}>
                      <InputLabel shrink htmlFor="dob-input">
                        Date of Birth *
                      </InputLabel>
                      <OutlinedInput
                        id="dob-input"
                        type="date"
                        placeholder="Select date of birth"
                        value={userInfo.dateOfBirth || ""}
                        onChange={handleDOBChange}
                        onKeyDown={handleKeyPress}
                        startAdornment={
                          <InputAdornment position="start">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CakeIcon
                                style={{ color: "#ee6c4d", fontSize: 25 }}
                              />
                              <div
                                style={{
                                  height: "30px",
                                  width: "2px",
                                  backgroundColor: "#ee6c4d",
                                  marginLeft: "8px",
                                  borderRadius: "1px",
                                }}
                              />
                            </div>
                          </InputAdornment>
                        }
                        label="Date of Birth *"
                        notched
                        required
                      />
                    </FormControl>
                  </Box>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{  width: "100%" }}
                  >
                    <strong>Date of Birth:</strong>{" "}
                    {formatDOBForDisplay(userInfo.dateOfBirth)}
                  </Typography>
                )}

                {/* SAVE */}
                {editStates.all && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      onKeyDown={handleKeyPress}
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "#ee6c4d",
                        width: { xs: "45%", sm: "60%", md: "150px" },
                        letterSpacing: "0.5px",
                        cursor: "pointer",
                        border: "1px solid transparent",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#d65b3d",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#ee6c4d",
                        border: "1px solid #ee6c4d",
                        borderRadius: "8px",
                        textTransform: "capitalize",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#d65b3d",
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => {
                        toggleEdit("all");
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Tabs */}
        {tab === 2 && <Settingg />}
        {tab === 1 && <SocialMedia />}
        {tab === 3 && (
          <Card sx={{ p: 6, m: 6 }}>
            <Typography variant="h6">Roadmap</Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Card>
                <CardContent>
                  <Typography>Frontend</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography>Backend</Typography>
                </CardContent>
              </Card>
            </Box>
          </Card>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: isMobile ? "bottom" : isTablet ? "bottom" : "top",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              backgroundColor: "#F5F5DC",
              color: "#ee6c4d",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              textAlign: "center",
              padding: "10px 20px",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default UpdateUser;
