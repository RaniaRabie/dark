// /*
// - File Name: UpdateUser.jsx
// - Author: Nourhan Khaled
// - Date of Creation: 10/4/2025
// - Versions Information: 1.0.0
// - Dependencies:
//   {
//   REACT,
//   @mui/material,
//   @mui/icons-material,
//   axios,
//   context/AuthContext
//   }
// - Contributors: Rania Rabie , Shrouk Ahmed ,Nourhan Khaled
//  - Last Modified Date: 2/5/2025
// - Description: Component for editing and updating user profile information with validation and API integration
// */
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   TextField,
//   Button,
//   IconButton,
//   Paper,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Tooltip,
//   Snackbar,
//   Alert,
//   useTheme,
//   InputAdornment,
//   OutlinedInput,
//   useMediaQuery,
// } from "@mui/material";
// import Settingg from "./Settingg";
// import SocialMedia from "./SocialMedia";
// import UserRoadmapPage from "./UserRoadmapPage";
// import { Edit as EditIcon } from "@mui/icons-material";
// import axios from "axios";
// import SideBar from "./SideBar_user";
// import { useAuth } from "context/AuthContext";
// import {
//   Person as PersonIcon,
//   Public as PublicIcon,
//   Phone as PhoneIcon,
//   Cake as CakeIcon,
//   Image as ImageIcon,
// } from "@mui/icons-material";

// function UpdateUser() {
//   const [tab, setTab] = useState(0);
//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     country: "",
//     phoneNumber: "",
//     dateOfBirth: "",
//     imageUrl: "",
//   });

//   // Snackbar State
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const handleSnackbarClose = () => setSnackbarOpen(false);

//   const [editField, setEditField] = useState(null);
//   const [editStates, setEditStates] = useState({
//     name: false,
//     country: false,
//     phoneNumber: false,
//     dateOfBirth: false,
//     imageUrl: false,
//     all: false,
//   });
//   const [nameError, setNameError] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [dobError, setDobError] = useState("");
//   const governorates = ["Egypt"];
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
//   const { userId } = useAuth();

//   // Fetch user data on component mount
//   useEffect(() => {
//     axios
//       .get(
//         `https://careerguidance.runasp.net/api/userProfile/GetUserById/${userId}`
//       )
//       .then((response) => {
//         const data = response.data || {};
//         setUserInfo({
//           name: data.name || "",
//           country: data.country || "",
//           phoneNumber: data.phoneNumber || "",
//           dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
//           imageUrl: data.imageUrl || "",
//         });
//       })
//       .catch((error) => {
//         console.error("Error fetching user data", error);
//         setSnackbarMessage(" Failed to load user data.");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       });
//   }, [userId]);

//   // Validate name with detailed rules
//   const getNameValidationMessages = (name) => {
//     const cleaned = name.trim();
//     const nameRegex = /^[a-zA-Z\s]+$/;
//     return [
//       {
//         condition: !!cleaned,
//         message: "Name is required",
//         valid: !!cleaned,
//       },
//       {
//         condition: cleaned.length >= 3,
//         message: "At least 3 characters",
//         valid: !cleaned || cleaned.length >= 3,
//       },
//       {
//         condition: cleaned.length <= 30,
//         message: "Less than 30 characters",
//         valid: !cleaned || cleaned.length <= 30,
//       },
//       {
//         condition: !cleaned.match(/\d/),
//         message: "No numbers allowed",
//         valid: !cleaned || !cleaned.match(/\d/),
//       },
//       {
//         condition: nameRegex.test(cleaned),
//         message: "No special characters",
//         valid: !cleaned || nameRegex.test(cleaned),
//       },
//     ];
//   };

//   const validateName = (name) => {
//     const messages = getNameValidationMessages(name);
//     const firstError = messages.find((m) => !m.valid);
//     return firstError ? firstError.message : "";
//   };

//   // Handle input changes and validate name
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserInfo((prev) => ({
//       ...prev,
//       [name]: value.trim(),
//     }));
//     if (name === "name") {
//       setNameError(validateName(value));
//     }
//   };

//   // Toggle edit mode for individual fields or all fields
//   const toggleEdit = (field) => {
//     if (field === "all") {
//       setEditStates((prev) => {
//         const newState = !prev.all;
//         return {
//           name: newState,
//           country: newState,
//           phoneNumber: newState,
//           dateOfBirth: newState,
//           imageUrl: newState,
//           all: newState,
//         };
//       });
//     } else {
//       setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
//     }
//   };

//   // Format date of birth for display
//   const formatDOBForDisplay = (isoDate) => {
//     if (!isoDate || isoDate.startsWith("0001")) return "N/A";
//     const date = new Date(isoDate);
//     if (isNaN(date.getTime())) return "N/A";
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Validate date of birth
//   const validateDOB = (dob) => {
//     if (!dob) return "Date of birth is required";
//     const date = new Date(dob);
//     if (isNaN(date.getTime())) return "Invalid date";
//     const today = new Date();
//     let age = today.getFullYear() - date.getFullYear();
//     const monthDiff = today.getMonth() - date.getMonth();
//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < date.getDate())
//     ) {
//       age--;
//     }
//     if (age < 9 || age > 55) {
//       return "Age must be between 9 and 55 years";
//     }
//     return "";
//   };
//   // Handle date of birth input changes
//   const handleDOBChange = (e) => {
//     const value = e.target.value;
//     setUserInfo((prev) => ({
//       ...prev,
//       dateOfBirth: value,
//     }));
//     setDobError(validateDOB(value));
//   };

//   // Validate and format phone number input
//   const handlePhoneInput = (e) => {
//     let input = e.target.value.replace(/\D/g, "");
//     const validPrefixes = ["010", "011", "012", "015"];
//     const isValidPrefix = validPrefixes.some((prefix) =>
//       input.startsWith(prefix)
//     );
//     if (isValidPrefix && input.length === 11) {
//       input = `+20${input.substring(1)}`;
//       setUserInfo((prev) => ({ ...prev, phoneNumber: input }));
//       setPhoneError("");
//     } else {
//       setPhoneError(
//         "Phone number must start with 010, 011, 012, or 015 and be followed by 8 digits"
//       );
//       setUserInfo((prev) => ({ ...prev, phoneNumber: e.target.value }));
//     }
//   };

//   // Handle Enter key press to trigger save
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSave();
//     }
//   };
//   const handleSave = async () => {
//     try {
//       if (!userInfo.name) {
//         setNameError("Name is required.");
//         setSnackbarMessage("Name is required.");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//         return;
//       } else {
//         setNameError("");
//       }

//       if (phoneError) {
//         setSnackbarMessage("Please correct phone number before saving");
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//         return;
//       }

//       const token = localStorage.getItem("accessToken");

//       const updatedData = {
//         name: userInfo.name || "",
//         country: userInfo.country || "",
//         phoneNumber: userInfo.phoneNumber || null,
//         dateOfBirth: userInfo.dateOfBirth
//           ? new Date(userInfo.dateOfBirth).toISOString()
//           : null,
//         imageUrl: userInfo.imageUrl || "",
//       };

//       console.log("Updated Data =>", JSON.stringify(updatedData, null, 2));

//       await axios.put(
//         `https://careerguidance.runasp.net/api/userProfile/UpdateProfile/${userId}`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setSnackbarMessage("Profile updated successfully!");

//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);

//       setEditField(null);
//       setEditStates({
//         name: false,
//         country: false,
//         phoneNumber: false,
//         dateOfBirth: false,
//         imageUrl: null,
//         all: false,
//       });
//       setTimeout(() => window.location.reload(), 800);
//     } catch (error) {
//       console.error("Error updating profile", error);
//       let message = "An unexpected error occurred.";
//       if (error.response && error.response.data?.errors) {
//         const backendErrors = error.response.data.errors;
//         if (Array.isArray(backendErrors) && backendErrors.length > 0) {
//           message = backendErrors[0];
//         } else if (typeof backendErrors === "object") {
//           const firstKey = Object.keys(backendErrors)[0];
//           const firstError = backendErrors[firstKey]?.[0];
//           if (firstError) {
//             message = firstError;
//           }
//         }
//       }
//       setSnackbarMessage(message);
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//       setTimeout(() => window.location.reload(), 800);
//     }
//   };

//   // Styles for input fields
//   const inputStyleFull = {
//     width: { xs: "100%", sm: "90%", md: "85%", lg: "100%" },
//     "& .MuiOutlinedInput-root": {
//       borderRadius: "25px",
//       height: "45px",
//       paddingRight: 1,
//       backgroundColor: "transparent",
//       "& fieldset": { border: "1px solid #ee6c4d" },
//       "&:hover fieldset": { borderColor: "#ee6c4d" },
//       "&.Mui-focused fieldset": { borderColor: "#ee6c4d" },
//     },
//     "& .MuiInputBase-input": { color: theme.palette.text.primary },
//     "& .MuiInputBase-input::placeholder": {
//       color: theme.palette.text.primary,
//       opacity: 0.7,
//     },
//     "& input:-webkit-autofill": {
//       WebkitBoxShadow: "0 0 0 10px transparent inset",
//       backgroundColor: "transparent",
//       WebkitTextFillColor: theme.palette.text.primary,
//       transition: "background-color 5000s ease-in-out 0s",
//     },
//     "& input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
//       backgroundColor: "transparent",
//       WebkitBoxShadow: "0 0 0 10px transparent inset",
//       transition: "background-color 5000s ease-in-out 0s",
//     },
//   };
//   // Input adornment with custom icons
//   const adornmentProps = (icon) => ({
//     startAdornment: (
//       <InputAdornment position="start">
//         <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
//           {React.cloneElement(icon, {
//             style: { color: "#ee6c4d", fontSize: 25, ...icon.props?.style },
//           })}
//           <div
//             style={{
//               height: "30px",
//               width: "2px",
//               backgroundColor: "#ee6c4d",
//               marginLeft: "8px",
//               marginRight: "4px",
//               borderRadius: "1px",
//             }}
//           />
//         </div>
//       </InputAdornment>
//     ),
//   });
//   // Typography styles for display fields
//   const typographySx = {
//     display: "flex",
//     alignItems: "center",
//     gap: 1,
//     fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
//     fontWeight: 500,
//     color: theme.palette.text.primary,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//     maxWidth: "100%",
//   };
//   // Tooltip styles for validation messages
//   const tooltipProps = {
//     placement: isMobile ? "bottom" : isTablet ? "top" : "right-start",
//     arrow: true,
//     PopperProps: {
//       sx: {
//         "& .MuiTooltip-tooltip": {
//           backgroundColor: "#f5f5f5",
//           color: "#ee6c4d",
//           fontSize: isMobile ? "12px" : "13px",
//           fontWeight: "bold",
//           padding: "8px 12px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//         },
//         "& .MuiTooltip-arrow": { color: "#f5f5f5" },
//       },
//       modifiers: [
//         {
//           name: "offset",
//           options: {
//             offset: isMobile ? [0, 8] : isTablet ? [0, 10] : [10, -5],
//           },
//         },
//       ],
//     },
//   };

//   // Render the profile update form

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 3,
//         overflow: "hidden",
//       }}
//     >
//       {/* Sidebar */}
//       <Box sx={{ flexShrink: 0 }}>
//         <SideBar tab={tab} setTab={setTab} />
//       </Box>

//       {/* Main Content */}
//       <Box
//         sx={{
//           flex: 1,
//           // ml: { xs: `${sidebarWidth}px`, sm: `${sidebarWidth}px` },
//           p: { xs: 1, sm: 2, md: 3 },
//           overflowY: "auto",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         {tab === 0 && (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: 3,
//               marginTop: "50px",
//               justifyContent: "center",
//               width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
//               transition: "all 0.3s ease",
//             }}
//           >
//             <Paper
//               elevation={3}
//               sx={{
//                 borderRadius: 2,
//                 p: { xs: 2, sm: 3, md: 4 },
//                 width: { xs: "100%", sm: "95%", md: "90%", lg: "60%" },
//                 maxWidth: { xs: "100%", sm: 550, md: 600, lg: 650 },
//                 minWidth: { xs: "90%", sm: "80%", md: "60%" },
//                 backgroundColor: theme.palette.background.paper,
//                 boxShadow:
//                   theme.palette.mode === "dark"
//                     ? "0 2px 8px rgba(0, 0, 0, 0.3)"
//                     : "0 2px 8px rgba(0, 0, 0, 0.1)",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               {/* العنوان + زر التعديل */}
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   mb: 2,
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     color: theme.palette.text.primary,
//                     fontSize: { xs: 20, sm: 24, md: 28, lg: 35 },
//                     fontWeight: "bold",
//                     textShadow: "1px 1px 1px #b5adad",
//                   }}
//                 >
//                   Edit Profile
//                 </Typography>
//                 <IconButton onClick={() => toggleEdit("all")}>
//                   <EditIcon
//                     sx={{
//                       color: "#ee6c4d",
//                       fontSize: { xs: 26, sm: 28, md: 35 },
//                       fontWeight: "bold",
//                       textShadow: "1px 1px 1px #b5adad",
//                     }}
//                   />
//                 </IconButton>
//               </Box>

//               {/* EDIT FIELDS*/}
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 {/* IMAGE */}
//                 {userInfo.imageUrl && (
//                   <Box
//                     sx={{ display: "flex", justifyContent: "center", mb: 2 }}
//                   >
//                     <Avatar
//                       src={userInfo.imageUrl}
//                       alt="Profile"
//                       sx={{
//                         width: { xs: 70, sm: 90, md: 100, lg: 120 },
//                         height: { xs: 70, sm: 90, md: 100, lg: 120 },
//                         // width: 120,
//                         // height: 120,
//                         border: "2px solid #ee6c4d",
//                       }}
//                     />
//                   </Box>
//                 )}

//                 {/* IMAGE URL */}
//                 {editStates.all && (
//                   <Tooltip
//                     title={
//                       userInfo.imageUrl &&
//                       !userInfo.imageUrl.startsWith("https://")
//                         ? "Image URL must start with https://"
//                         : ""
//                     }
//                     open={
//                       userInfo.imageUrl &&
//                       !userInfo.imageUrl.startsWith("https://")
//                     }
//                     placement={
//                       isMobile ? "bottom" : isTablet ? "top" : "right-start"
//                     }
//                     arrow
//                     PopperProps={{
//                       sx: {
//                         "& .MuiTooltip-tooltip": {
//                           backgroundColor: "#f5f5f5",
//                           color: "#ee6c4d",
//                           fontSize: isMobile ? "12px" : "13px",
//                           fontWeight: "bold",
//                           padding: "8px 12px",
//                           borderRadius: "8px",
//                           boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//                         },
//                         "& .MuiTooltip-arrow": {
//                           color: "#f5f5f5",
//                         },
//                       },
//                       modifiers: [
//                         {
//                           name: "offset",
//                           options: {
//                             offset: isMobile
//                               ? [0, 8]
//                               : isTablet
//                               ? [0, 10]
//                               : [10, -5],
//                           },
//                         },
//                       ],
//                     }}
//                   >
//                     <TextField
//                       label="Image URL"
//                       placeholder="Enter image URL (https://...)"
//                       name="imageUrl"
//                       value={userInfo.imageUrl || ""}
//                       onChange={handleInputChange}
//                       fullWidth
//                       onKeyDown={handleKeyPress}
//                       InputProps={adornmentProps(<ImageIcon />)}
//                       sx={inputStyleFull}
//                       error={
//                         userInfo.imageUrl &&
//                         !userInfo.imageUrl.startsWith("https://")
//                       }
//                     />
//                   </Tooltip>
//                 )}

//                 {/* Name input or display */}
//                 {editStates.all ? (
//                   <Tooltip
//                     title={
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 0.5,
//                         }}
//                       >
//                         {getNameValidationMessages(userInfo.name).map(
//                           (item, index) => (
//                             <Typography
//                               key={index}
//                               sx={{
//                                 color: item.valid ? "green" : "red",
//                                 fontSize: "12px",
//                               }}
//                             >
//                               {item.message}
//                             </Typography>
//                           )
//                         )}
//                       </Box>
//                     }
//                     open={editStates.all && !!nameError}
//                     {...tooltipProps}
//                   >
//                     <TextField
//                       label="Name"
//                       placeholder="Enter your full name"
//                       name="name"
//                       value={userInfo.name || ""}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         setUserInfo((prev) => ({ ...prev, name: value }));
//                         setNameError(validateName(value));
//                       }}
//                       fullWidth
//                       onKeyDown={handleKeyPress}
//                       margin="normal"
//                       error={!!nameError}
//                       InputProps={adornmentProps(<PersonIcon />)}
//                       InputLabelProps={{
//                         style: { color: theme.palette.text.primary },
//                       }}
//                       sx={inputStyleFull}
//                     />
//                   </Tooltip>
//                 ) : (
//                   <Typography variant="body1" sx={typographySx}>
//                     <PersonIcon
//                       sx={{
//                         color: "#ee6c4d",
//                         fontSize: { xs: 18, sm: 20, md: 22 },
//                       }}
//                     />
//                     <strong>Name:</strong> {userInfo.name || "N/A"}
//                   </Typography>
//                 )}

//                 {/* Country input or display */}
//                 {editStates.all ? (
//                   <TextField
//                     select
//                     label="Country"
//                     placeholder="Select your country"
//                     name="country"
//                     value={userInfo.country || ""}
//                     onChange={handleInputChange}
//                     fullWidth
//                     onKeyDown={handleKeyPress}
//                     InputProps={adornmentProps(<PublicIcon />)}
//                     InputLabelProps={{
//                       style: { color: theme.palette.text.primary },
//                     }}
//                     sx={inputStyleFull}
//                   >
//                     {governorates.map((gov) => (
//                       <MenuItem key={gov} value={gov}>
//                         {gov}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 ) : (
//                   <Typography variant="body1" sx={typographySx}>
//                     <PublicIcon
//                       sx={{
//                         color: "#ee6c4d",
//                         fontSize: { xs: 18, sm: 20, md: 22 },
//                       }}
//                     />
//                     <strong>Country:</strong> {userInfo.country || "N/A"}
//                   </Typography>
//                 )}

//                 {/* Phone number input or display */}
//                 {editStates.all ? (
//                   <Tooltip
//                     title={
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 0.5,
//                         }}
//                       >
//                         {!userInfo.phoneNumber ? (
//                           <Typography sx={{ color: "red", fontSize: "12px" }}>
//                             Phone number is required
//                           </Typography>
//                         ) : phoneError ? (
//                           <Typography sx={{ color: "red", fontSize: "12px" }}>
//                             {phoneError}
//                           </Typography>
//                         ) : null}
//                       </Box>
//                     }
//                     open={editStates.all && !!phoneError}
//                     {...tooltipProps}
//                   >
//                     <TextField
//                       label="Phone Number"
//                       placeholder="Enter phone number (e.g., 011********)"
//                       name="phone"
//                       value={userInfo.phoneNumber || ""}
//                       onChange={handlePhoneInput}
//                       fullWidth
//                       onKeyDown={handleKeyPress}
//                       error={!!phoneError}
//                       InputProps={adornmentProps(<PhoneIcon />)}
//                       InputLabelProps={{
//                         style: { color: theme.palette.text.primary },
//                       }}
//                       sx={inputStyleFull}
//                     />
//                   </Tooltip>
//                 ) : (
//                   <Typography variant="body1" sx={typographySx}>
//                     <PhoneIcon
//                       sx={{
//                         color: "#ee6c4d",
//                         fontSize: { xs: 18, sm: 20, md: 22 },
//                       }}
//                     />
//                     <strong>Phone:</strong> {userInfo.phoneNumber || "N/A"}
//                   </Typography>
//                 )}
//                 {/* Date of birth input or display */}
//                 {editStates.all ? (
//                   <Tooltip
//                     title={
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 0.5,
//                         }}
//                       >
//                         {!userInfo.dateOfBirth ? (
//                           <Typography sx={{ color: "red", fontSize: "12px" }}>
//                             Date of birth is required
//                           </Typography>
//                         ) : dobError ? (
//                           <Typography sx={{ color: "red", fontSize: "12px" }}>
//                             {dobError}
//                           </Typography>
//                         ) : null}
//                       </Box>
//                     }
//                     open={
//                       editStates.all && (!userInfo.dateOfBirth || !!dobError)
//                     }
//                     {...tooltipProps}
//                   >
//                     <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
//                       <FormControl fullWidth sx={inputStyleFull}>
//                         <InputLabel
//                           shrink
//                           htmlFor="dob-input"
//                           style={{ color: theme.palette.text.primary }}
//                         >
//                           Date of Birth
//                         </InputLabel>
//                         <OutlinedInput
//                           id="dob-input"
//                           type="date"
//                           placeholder="Select date of birth"
//                           value={userInfo.dateOfBirth || ""}
//                           onChange={handleDOBChange}
//                           onKeyDown={handleKeyPress}
//                           startAdornment={
//                             <InputAdornment position="start">
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 <CakeIcon
//                                   style={{ color: "#ee6c4d", fontSize: 25 }}
//                                 />
//                                 <div
//                                   style={{
//                                     height: "30px",
//                                     width: "2px",
//                                     backgroundColor: "#ee6c4d",
//                                     marginLeft: "8px",
//                                     borderRadius: "1px",
//                                   }}
//                                 />
//                               </div>
//                             </InputAdornment>
//                           }
//                           label="Date of Birth"
//                           notched
//                           required
//                         />
//                       </FormControl>
//                     </Box>
//                   </Tooltip>
//                 ) : (
//                   <Typography variant="body1" sx={typographySx}>
//                     <CakeIcon
//                       sx={{
//                         color: "#ee6c4d",
//                         fontSize: { xs: 18, sm: 20, md: 22 },
//                       }}
//                     />
//                     <strong>Date of Birth:</strong>{" "}
//                     {formatDOBForDisplay(userInfo.dateOfBirth)}
//                   </Typography>
//                 )}

//                 {/* Save and Cancel buttons */}
//                 {editStates.all && (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-evenly",
//                       mt: 2,
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       onClick={handleSave}
//                       onKeyDown={handleKeyPress}
//                       sx={{
//                         textTransform: "capitalize",
//                         backgroundColor: "#ee6c4d",
//                         width: { xs: "45%", sm: "60%", md: "150px" },
//                         letterSpacing: "0.5px",
//                         cursor: "pointer",
//                         border: "1px solid transparent",
//                         borderRadius: "8px",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           backgroundColor: "#d65b3d",
//                           transform: "scale(1.05)",
//                         },
//                       }}
//                     >
//                       Save Changes
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       sx={{
//                         color: "#ee6c4d",
//                         border: "1px solid #ee6c4d",
//                         borderRadius: "8px",
//                         textTransform: "capitalize",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           backgroundColor: "#d65b3d",
//                           transform: "scale(1.05)",
//                         },
//                       }}
//                       onClick={() => {
//                         toggleEdit("all");
//                         setTimeout(() => window.location.reload(), 1000);
//                       }}
//                     >
//                       Cancel
//                     </Button>
//                   </Box>
//                 )}
//               </Box>
//             </Paper>
//           </Box>
//         )}

//         {/* Tabs */}
//         {tab === 2 && <Settingg />}
//         {tab === 1 && <SocialMedia />}
//         {tab === 3 && <UserRoadmapPage />}

//         {/* Snackbar for user feedback */}
//         <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={6000}
//           onClose={handleSnackbarClose}
//           anchorOrigin={{
//             vertical: isMobile ? "bottom" : isTablet ? "bottom" : "top",
//             horizontal: "center",
//           }}
//         >
//           <Alert
//             onClose={handleSnackbarClose}
//             // @ts-ignore
//             severity={snackbarSeverity}
//             sx={{
//               width: "100%",
//               backgroundColor: "#F5F5DC",
//               color: "#ee6c4d",
//               borderRadius: "8px",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
//               fontSize: { xs: "14px", sm: "15px", md: "16px" },
//               textAlign: "center",
//               padding: "10px 20px",
//             }}
//           >
//             {snackbarMessage}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Box>
//   );
// }

// export default UpdateUser;
/*
- File Name: UpdateUser.jsx
- Author: Nourhan Khaled
- Date of Creation: 10/4/2025
- Versions Information: 1.0.1
- Dependencies:
  {
    REACT,
    @mui/material,
    @mui/icons-material,
    axios,
    context/AuthContext
  }
- Contributors: Rania Rabie, Shrouk Ahmed, Nourhan Khaled
- Last Modified Date: 5/3/2025
- Description: Component for editing and updating user profile information with validation and API integration
*/
import React, { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import {
  Box,
  Typography,
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
  CircularProgress,
} from "@mui/material";
import Settingg from "./Settingg";
import SocialMedia from "./SocialMedia";
import UserRoadmapPage from "./UserRoadmapPage";
import { Edit as EditIcon, Person as PersonIcon, Public as PublicIcon, Phone as PhoneIcon, Cake as CakeIcon, Image as ImageIcon } from "@mui/icons-material";
import axios from "axios";
import SideBar from "./SideBar_user";
import { useAuth } from "context/AuthContext";
import {api} from "../../../services/axiosInstance"


// Reducer for managing edit states
const editReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_ALL":
      const newState = !state.all;
      return {
        name: newState,
        country: newState,
        phoneNumber: newState,
        dateOfBirth: newState,
        imageUrl: newState,
        all: newState,
      };
    case "TOGGLE_FIELD":
      return { ...state, [action.field]: !state[action.field] };
    default:
      return state;
  }
};

function UpdateUser() {
  const [tab, setTab] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: "",
    country: "",
    phoneNumber: "",
    dateOfBirth: "",
    imageUrl: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editStates, dispatchEdit] = useReducer(editReducer, {
    name: false,
    country: false,
    phoneNumber: false,
    dateOfBirth: false,
    imageUrl: false,
    all: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const governorates = ["Egypt"];
  const { user } = useAuth();
  const userId = user?.id;

  // Close Snackbar
  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/api/userProfile/GetUserById/${userId}`
        );
        const data = response.data || {};
        setUserInfo({
          name: data.name || "",
          country: data.country || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user data", error);
        setSnackbar({
          open: true,
          message: "Failed to load user data.",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  // Name validation
  const getNameValidationMessages = useCallback((name) => {
    const cleaned = name.trim();
    const nameRegex = /^[a-zA-Z\s]+$/;
    return [
      { condition: !!cleaned, message: "Name is required", valid: !!cleaned },
      { condition: cleaned.length >= 3, message: "At least 3 characters", valid: !cleaned || cleaned.length >= 3 },
      { condition: cleaned.length <= 30, message: "Less than 30 characters", valid: !cleaned || cleaned.length <= 30 },
      { condition: !cleaned.match(/\d/), message: "No numbers allowed", valid: !cleaned || !cleaned.match(/\d/) },
      { condition: nameRegex.test(cleaned), message: "No special characters", valid: !cleaned || nameRegex.test(cleaned) },
    ];
  }, []);

  const validateName = useCallback((name) => {
    const messages = getNameValidationMessages(name);
    const firstError = messages.find((m) => !m.valid);
    return firstError ? firstError.message : "";
  }, [getNameValidationMessages]);

  // DOB validation
  const validateDOB = useCallback((dob) => {
    if (!dob) return "Date of birth is required";
    const date = new Date(dob);
    if (isNaN(date.getTime())) return "Invalid date";
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    if (age < 9 || age > 55) return "Age must be between 9 and 55 years";
    return "";
  }, []);

  // Image URL validation
  const validateImageUrl = useCallback((url) => {
    if (!url) return "";
    const urlRegex = /^https:\/\/.*\.(jpeg|jpg|png|gif|bmp)$/i;
    return urlRegex.test(url) ? "" : "Invalid image URL (must be https:// and end with .jpeg, .jpg, .png, .gif, or .bmp)";
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value.trim() }));
    if (name === "name") {
      setErrors((prev) => ({ ...prev, name: validateName(value) }));
    } else if (name === "imageUrl") {
      setErrors((prev) => ({ ...prev, imageUrl: validateImageUrl(value) }));
    }
  }, [validateName, validateImageUrl]);

  // Handle DOB change
  const handleDOBChange = useCallback((e) => {
    const value = e.target.value;
    setUserInfo((prev) => ({ ...prev, dateOfBirth: value }));
    setErrors((prev) => ({ ...prev, dob: validateDOB(value) }));
  }, [validateDOB]);

  // Handle phone input
  const handlePhoneInput = useCallback((e) => {
    let input = e.target.value.replace(/\D/g, "");
    const validPrefixes = ["010", "011", "012", "015"];
    const isValidPrefix = validPrefixes.some((prefix) => input.startsWith(prefix));
    if (isValidPrefix && input.length === 11) {
      input = `+20${input.substring(1)}`;
      setUserInfo((prev) => ({ ...prev, phoneNumber: input }));
      setErrors((prev) => ({ ...prev, phone: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must start with 010, 011, 012, or 015 and be followed by 8 digits",
      }));
      setUserInfo((prev) => ({ ...prev, phoneNumber: e.target.value }));
    }
  }, []);

  // Toggle edit mode
  const toggleEdit = useCallback((field) => {
    dispatchEdit({ type: field === "all" ? "TOGGLE_ALL" : "TOGGLE_FIELD", field });
  }, []);

  // Format DOB for display
  const formatDOBForDisplay = useCallback((isoDate) => {
    if (!isoDate || isoDate.startsWith("0001")) return "N/A";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      if (!userInfo.name || errors.name) {
        setErrors((prev) => ({ ...prev, name: validateName(userInfo.name) || "Name is required." }));
        setSnackbar({ open: true, message: "Please correct name before saving.", severity: "error" });
        return;
      }
      if (errors.phone) {
        setSnackbar({ open: true, message: "Please correct phone number before saving.", severity: "error" });
        return;
      }
      if (!userInfo.dateOfBirth || errors.dob) {
        setErrors((prev) => ({ ...prev, dob: validateDOB(userInfo.dateOfBirth) || "Date of birth is required." }));
        setSnackbar({ open: true, message: "Please correct date of birth before saving.", severity: "error" });
        return;
      }
      if (errors.imageUrl) {
        setSnackbar({ open: true, message: "Please correct image URL before saving.", severity: "error" });
        return;
      }



      setIsLoading(true);
      const updatedData = {
        name: userInfo.name || "",
        country: userInfo.country || "",
        phoneNumber: userInfo.phoneNumber || null,
        dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toISOString() : null,
        imageUrl: userInfo.imageUrl || "",
      };

      await api.put(
        `/api/userProfile/UpdateProfile/${userId}`,
        updatedData,

      );

      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      dispatchEdit({ type: "TOGGLE_ALL" });
    } catch (error) {
      console.error("Error updating profile", error);
      let message = "An unexpected error occurred.";
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          message = backendErrors[0];
        } else if (typeof backendErrors === "object") {
          const firstKey = Object.keys(backendErrors)[0];
          const firstError = backendErrors[firstKey]?.[0];
          if (firstError) message = firstError;
        }
      }
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, errors, userId, validateName, validateDOB]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  // Input styles
  const inputStyleFull = useMemo(() => ({
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
    "& .MuiInputBase-input": { color: theme.palette.text.primary },
    "& .MuiInputBase-input::placeholder": { color: theme.palette.text.primary, opacity: 0.7 },
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
  }), [theme]);

  // Input adornment
  const adornmentProps = useCallback((icon) => ({
    startAdornment: (
      <InputAdornment position="start">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {React.cloneElement(icon, { style: { color: "#ee6c4d", fontSize: 25, ...icon.props?.style } })}
          <div style={{ height: "30px", width: "2px", backgroundColor: "#ee6c4d", marginLeft: "8px", marginRight: "4px", borderRadius: "1px" }} />
        </div>
      </InputAdornment>
    ),
  }), []);

  // Typography styles
  const typographySx = useMemo(() => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
    fontWeight: 500,
    color: theme.palette.text.primary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  }), [theme]);

  // Tooltip styles
  const tooltipProps = useMemo(() => ({
    placement: isMobile ? "bottom" : isTablet ? "top" : "right-start",
    arrow: true,
    PopperProps: {
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
        "& .MuiTooltip-arrow": { color: "#f5f5f5" },
      },
      modifiers: [{ name: "offset", options: { offset: isMobile ? [0, 8] : isTablet ? [0, 10] : [10, -5] } }],
    },
  }), [isMobile, isTablet]);

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", alignItems: "center", justifyContent: "center", p: 3, overflow: "hidden" }}>
      {/* Sidebar */}
      <Box sx={{ flexShrink: 0, width: { xs: 60, sm: 80, md: 100 } }}>
        <SideBar tab={tab} setTab={setTab} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 3 }, overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center", transition: "margin-left 0.3s ease" }}>
        {tab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, justifyContent: "center", width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, transition: "all 0.3s ease" }}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                p: { xs: 2, sm: 3, md: 4 },
                width: { xs: "100%", sm: "95%", md: "90%", lg: "60%" },
                maxWidth: { xs: "100%", sm: 550, md: 600, lg: 650 },
                minWidth: { xs: "90%", sm: "80%", md: "60%" },
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.palette.mode === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
                  <CircularProgress sx={{ color: "#ee6c4d" }} />
                </Box>
              ) : (
                <>
                  {/* Header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ color: theme.palette.text.primary, fontSize: { xs: 20, sm: 24, md: 28, lg: 35 }, fontWeight: "bold", textShadow: "1px 1px 1px #b5adad" }}>
                      Edit Profile
                    </Typography>
                    <IconButton onClick={() => toggleEdit("all")}>
                      <EditIcon sx={{ color: "#ee6c4d", fontSize: { xs: 26, sm: 28, md: 35 }, fontWeight: "bold", textShadow: "1px 1px 1px #b5adad" }} />
                    </IconButton>
                  </Box>

                  {/* Edit Fields */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Image */}
                    {userInfo.imageUrl && (
                      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <Avatar
                          src={userInfo.imageUrl}
                          alt="Profile"
                          sx={{ width: { xs: 70, sm: 90, md: 100, lg: 120 }, height: { xs: 70, sm: 90, md: 100, lg: 120 }, border: "2px solid #ee6c4d" }}
                        />
                      </Box>
                    )}

                    {/* Image URL */}
                    {editStates.all && (
                      <Tooltip title={errors.imageUrl} open={!!errors.imageUrl} {...tooltipProps}>
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
                          error={!!errors.imageUrl}
                        />
                      </Tooltip>
                    )}

                    {/* Name */}
                    {editStates.all ? (
                      <Tooltip
                        title={
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            {getNameValidationMessages(userInfo.name).map((item, index) => (
                              <Typography key={index} sx={{ color: item.valid ? "green" : "red", fontSize: "12px" }}>
                                {item.message}
                              </Typography>
                            ))}
                          </Box>
                        }
                        open={editStates.all && !!errors.name}
                        {...tooltipProps}
                      >
                        <TextField
                          label="Name"
                          placeholder="Enter your full name"
                          name="name"
                          value={userInfo.name || ""}
                          onChange={handleInputChange}
                          fullWidth
                          onKeyDown={handleKeyPress}
                          margin="normal"
                          error={!!errors.name}
                          InputProps={adornmentProps(<PersonIcon />)}
                          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                          sx={inputStyleFull}
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="body1" sx={typographySx}>
                        <PersonIcon sx={{ color: "#ee6c4d", fontSize: { xs: 18, sm: 20, md: 22 } }} />
                        <strong>Name:</strong> {userInfo.name || "N/A"}
                      </Typography>
                    )}

                    {/* Country */}
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
                        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                        sx={inputStyleFull}
                      >
                        {governorates.map((gov) => (
                          <MenuItem key={gov} value={gov}>
                            {gov}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Typography variant="body1" sx={typographySx}>
                        <PublicIcon sx={{ color: "#ee6c4d", fontSize: { xs: 18, sm: 20, md: 22 } }} />
                        <strong>Country:</strong> {userInfo.country || "N/A"}
                      </Typography>
                    )}

                    {/* Phone Number */}
                    {editStates.all ? (
                      <Tooltip title={errors.phone} open={!!errors.phone} {...tooltipProps}>
                        <TextField
                          label="Phone Number"
                          placeholder="Enter phone number (e.g., 011********)"
                          name="phone"
                          value={userInfo.phoneNumber || ""}
                          onChange={handlePhoneInput}
                          fullWidth
                          onKeyDown={handleKeyPress}
                          error={!!errors.phone}
                          InputProps={adornmentProps(<PhoneIcon />)}
                          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
                          sx={inputStyleFull}
                        />
                      </Tooltip>
                    ) : (
                      <Typography variant="body1" sx={typographySx}>
                        <PhoneIcon sx={{ color: "#ee6c4d", fontSize: { xs: 18, sm: 20, md: 22 } }} />
                        <strong>Phone:</strong> {userInfo.phoneNumber || "N/A"}
                      </Typography>
                    )}

                    {/* Date of Birth */}
                    {editStates.all ? (
                      <Tooltip title={errors.dob} open={!!errors.dob} {...tooltipProps}>
                        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
                          <FormControl fullWidth sx={inputStyleFull}>
                            <InputLabel shrink htmlFor="dob-input" style={{ color: theme.palette.text.primary }}>
                              Date of Birth
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
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <CakeIcon style={{ color: "#ee6c4d", fontSize: 25 }} />
                                    <div style={{ height: "30px", width: "2px", backgroundColor: "#ee6c4d", marginLeft: "8px", borderRadius: "1px" }} />
                                  </div>
                                </InputAdornment>
                              }
                              label="Date of Birth"
                              notched
                              required
                            />
                          </FormControl>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Typography variant="body1" sx={typographySx}>
                        <CakeIcon sx={{ color: "#ee6c4d", fontSize: { xs: 18, sm: 20, md: 22 } }} />
                        <strong>Date of Birth:</strong> {formatDOBForDisplay(userInfo.dateOfBirth)}
                      </Typography>
                    )}

                    {/* Save and Cancel Buttons */}
                    {editStates.all && (
                      <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleSave}
                          disabled={isLoading}
                          sx={{
                            textTransform: "capitalize",
                            backgroundColor: "#ee6c4d",
                            width: { xs: "45%", sm: "60%", md: "150px" },
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            border: "1px solid transparent",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: "#d65b3d", transform: "scale(1.05)" },
                          }}
                        >
                          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Save Changes"}
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#ee6c4d",
                            border: "1px solid #ee6c4d",
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: "#d65b3d", transform: "scale(1.05)" },
                          }}
                          onClick={() => toggleEdit("all")}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Paper>
          </Box>
        )}

        {/* Tabs */}
        {tab === 2 && <Settingg />}
        {tab === 1 && <SocialMedia />}
        {tab === 3 && <UserRoadmapPage />}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: isMobile || isTablet ? "bottom" : "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
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
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default UpdateUser;