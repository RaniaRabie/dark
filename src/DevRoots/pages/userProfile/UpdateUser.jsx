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

  const [phoneError, setPhoneError] = useState("");
  const governorates = ["Egypt"];

  const isoDate = userInfo.dateOfBirth;
  const { userId } = useAuth();
  useEffect(() => {
    axios
      .get(
        `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`
      )
      .then((response) => {
        const data = response.data || {};
        setUserInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching user data", error);
        setSnackbarMessage(" Failed to load user data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
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

  const formatDOBForDisplay = (isoDate) => {
    if (!isoDate || isoDate.startsWith("0001")) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
  const [nameError, setNameError] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleSave = async () => {
    try {
      if (userInfo.name.length < 3) {
        setNameError("Name must be at least 3 characters long");
        return;
      } else {
        setNameError("");
      }

      if (phoneError) {
        setSnackbarMessage("Please correct phone number before saving");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const token = localStorage.getItem("accessToken");

      const updatedData = {
        name: userInfo.name || "",
        country: userInfo.country || "",
        phoneNumber: userInfo.phoneNumber || null,
        dateOfBirth:
          userInfo.dateOfBirth &&
          userInfo.dateOfBirth !== "0001-01-01T00:00:00" &&
          userInfo.dateOfBirth !== "0001-01-01"
            ? new Date(userInfo.dateOfBirth).toISOString()
            : new Date("2000-01-01").toISOString(),

        imageUrl: userInfo.imageUrl || "",
      };

      console.log("Updated Data =>", JSON.stringify(updatedData, null, 2));

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
      setSnackbarMessage("Error updating profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const theme = useTheme();

  const inputStyleFull = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      height: "45px",
      paddingRight: 1,

      backgroundColor: "transparent",
      "& fieldset": { border: "1px solid #ee6c4d" },
      "&:hover fieldset": { borderColor: "#ee6c4d" },
      "&.Mui-focused fieldset": { borderColor: "#ee6c4d" },
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
      <Box>
        <SideBar tab={tab} setTab={setTab} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "all 0.3s ease",
          // marginTop: editStates.all ? "30px" : "0",
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
              width: "60%",
              transition: "all 0.3s ease",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                p: 4,
                width: "60%",
                maxWidth: editStates.all ? "600px" : "400px",
                minWidth: { xs: "90%", sm: "80%", md: "60%" },
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
                    fontSize: "35px",
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
                      fontSize: "35px",
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
                        width: 120,
                        height: 120,
                        border: "2px solid #ee6c4d",
                      }}
                    />
                  </Box>
                )}

                {/* IMAGEURL*/}
                {editStates.all && (
                  <>
                    <TextField
                      label="Image URL"
                      name="imageUrl"
                      value={userInfo.imageUrl || ""}
                      onChange={handleInputChange}
                      fullWidth
                      onKeyDown={handleKeyPress}
                      InputProps={adornmentProps(<ImageIcon />)}
                      sx={inputStyleFull}
                    />
                  </>
                )}

                {/* NAME*/}
                {editStates.all ? (
                  <Tooltip
                    title={nameError || ""}
                    open={!!nameError}
                    placement="top-start"
                    arrow
                  >
                    <TextField
                      label="Name"
                      name="name"
                      onKeyDown={handleKeyPress}
                      placeholder="Enter your name"
                      value={userInfo.name || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUserInfo((prev) => ({ ...prev, name: value }));
                        setNameError(
                          value.length >= 3
                            ? ""
                            : "Name must be at least 3 characters long"
                        );
                      }}
                      onKeyDown={handleKeyPress}
                      fullWidth
                      margin="normal"
                      error={!!nameError}
                      InputProps={adornmentProps(<PersonIcon />)}
                      sx={inputStyleFull}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="body1">
                    <strong>Name:</strong> {userInfo.name}
                  </Typography>
                )}

                {/* Country*/}
                {editStates.all ? (
                  <TextField
                    select
                    label="Country"
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
                  <Typography variant="body1">
                    <strong>Country:</strong> {userInfo.country}
                  </Typography>
                )}

                {/* PHONE*/}
                {editStates.all ? (
                  <Tooltip
                    title={phoneError || ""}
                    open={!!phoneError}
                    placement="top-start"
                    arrow
                  >
                    <TextField
                      label="Phone Number"
                      name="phone"
                      value={userInfo.phoneNumber || ""}
                      onChange={handlePhoneInput}
                      fullWidth
                      onKeyDown={handleKeyPress}
                      error={!!phoneError}
                      InputProps={adornmentProps(<PhoneIcon />)}
                      sx={inputStyleFull}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="body1">
                    <strong>Phone:</strong> {userInfo.phoneNumber}
                  </Typography>
                )}

                {/* DOB*/}
                {editStates.all ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <FormControl fullWidth sx={inputStyleFull}>
                      <InputLabel shrink htmlFor="dob-input">
                        Date of Birth
                      </InputLabel>
                      <OutlinedInput
                        id="dob-input"
                        type="date"
                        onKeyDown={handleKeyPress}
                        value={
                          userInfo.dateOfBirth === ""
                            ? ""
                            : userInfo.dateOfBirth.slice(0, 10)
                        }
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            dateOfBirth: e.target.value,
                          }))
                        }
                        startAdornment={
                          <InputAdornment position="start">
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <CakeIcon
                                style={{ color: "#ee6c4d", fontSize: 25 }}
                              />
                              {/* الخط بعد الأيقونة */}
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
                        label="Date of Birth"
                        notched
                      />
                    </FormControl>
                  </Box>
                ) : (
                  <Typography variant="body1">
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
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      onKeyDown={handleKeyPress}
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: "#ee6c4d",
                        width: "150px",
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
                        textTransform:"capitalize",
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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            sx={{
              width: "100%",
              backgroundColor: "#F5F5DC",
              color: "#ee6c4d",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              fontSize: "16px",
              textAlign: "center",
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
