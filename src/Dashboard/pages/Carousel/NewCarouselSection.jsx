/*
- File Name: newCarouselSection.jsx
- Author: Rania Rabie
- Date of Creation: 4/22/2025
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom,
  }
- Contributors: rania rabie
- Last Modified Date: 10/12/2024
- Description : add new Carousel Section, 
                display all Carousel Section, 
                update, delete Carousel Section
*/

import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Tooltip,
  useTheme,
  Typography,
  Alert,
  Snackbar,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../../services/axiosInstance";

export default function NewCarouselSection() {
  const [newCarouselSection, setNewCarouselSection] = useState("");
  const [carouselSections, setCarouselSections] = useState([]);
  const [carouselSectionId, setCarouselSectionId] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const [errors, setErrors] = useState({
    newCarouselSection: false,
  });
  const [touched, setTouched] = useState({
    newCarouselSection: false,
  });
  const [open, setOpen] = useState(false);

  const validateFields = () => {
    const newErrors = {
      newCarouselSection: newCarouselSection === "",
    };

    setErrors(newErrors);
    return newErrors;
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const theme = useTheme();

  const handleAddSectionChange = (eo) => {
    setNewCarouselSection(eo.target.value);
    setErrors((prev) => ({
      ...prev,
      newCarouselSection: eo.target.value === "",
    }));
  };

  // const api = useAxios();
  // Fetch all carousel sections
  const fetchCarouselSections = async () => {
    try {
      const response = await api.get(
        "/api/Dashboard/GetAllCarouselSection"
      );
      setCarouselSections(response.data);
      // console.log("Fetched sections:", response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setErrorMessage("Failed to fetch carousel sections.");
      setOpenSnackbar(true);
    }
  };

  // GET: Fetch carousel sections on mount
  useEffect(() => {
    fetchCarouselSections();
  }, []);

  // POST: Add a new carousel section
  const handleNewCarouselSectionClick = async () => {
    setTouched({ newCarouselSection: true });
    const errors = validateFields();

    if (!errors.newCarouselSection) {
      try {
        await api.post(
          "/api/Dashboard/AddCarouselSection",
          {
            newCarouselSection: newCarouselSection,
          },
        );

        // Reset form and refresh the list
        setNewCarouselSection("");
        setTouched({ newCarouselSection: false });
        await fetchCarouselSections(); // Refresh the list
      } catch (error) {
        console.error("Failed to check roadmap name:", error);
        if (
          (error.response && error.response.status === 400) ||
          (error.response && error.response.status === 409) ||
          (error.response && error.response.status === 401)
        ) {
          const errorMessage = error.response.data.errors[1];
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setOpenSnackbar(true);
      }
    }
  };

  // PUT: Update an existing carousel section
  const handleUpdateNewCarouselSectionClick = async () => {
    setTouched({ newCarouselSection: true });
    const errors = validateFields();

    if (!errors.newCarouselSection && carouselSectionId) {
      try {
        await api.put(
          `/api/Dashboard/UpdateCarouselSection/${carouselSectionId}`,
          {
            newCarouselSection: newCarouselSection,
          }
        );

        // Reset form and refresh the list
        setNewCarouselSection("");
        setCarouselSectionId(null);
        setUpdate(false);
        setIsAccordionOpen(false);
        setTouched({ newCarouselSection: false });
        await fetchCarouselSections(); // Refresh the list to avoid ID conflicts
      } catch (error) {
        console.error("Error updating data:", error);
        let message = "An unexpected error occurred.";
        if (error.response) {
          const { status, data } = error.response;
          if ([400, 409, 401].includes(status)) {
            message = data.errors?.[1] || data.message || data;
          }
        }
        setErrorMessage(message);
        setOpenSnackbar(true);
      }
    } else {
      setErrorMessage("Invalid input or missing ID.");
      setOpenSnackbar(true);
    }
  };

  // delete
  const handleDelete = () => {
    if (carouselSectionId) {
      api
        .delete(
          `/api/Dashboard/DeleteCarouselSection/${carouselSectionId}`,
        )
        .then(() => {
          setCarouselSections((prevSections) =>
            prevSections.filter((section) => section.id !== carouselSectionId)
          );
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error deleting section:", error);
          handleCloseDialog();
        });
    }
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleEditSection = (section) => {
    setNewCarouselSection(section.newCarouselSection);
    setCarouselSectionId(section.id);
    setUpdate(true);
    setIsAccordionOpen(true); // Open the accordion when editing
  };

  const handleOpenDialog = (id) => {
    setCarouselSectionId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCarouselSectionId(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };
  const handleCancelClick = () => {
    toggleAccordion(); // Close the Accordion
    setUpdate(false); // Reset to "Add New Carousel Section"
    setNewCarouselSection("");
  };

  return (
    <>
      <Box sx={{ width: "80%", margin: "0 auto" }}>
        <Box>
          <Typography
            component={"h2"}
            variant="h5"
            sx={{ my: 2, textAlign: "center" }}
          >
            All Carousel Sections
          </Typography>
          <Stack spacing={2} alignItems={"center"}>
            {carouselSections.map((section) => (
              <Paper
                key={section.id}
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "90%", md: "50%" },
                  py: 1,
                  px: 2,
                }}
              >
                <Typography sx={{ flexGrow: 1 }}>
                  {section.newCarouselSection}
                </Typography>

                <Tooltip title="Edit section">
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditSection(section)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete section">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleOpenDialog(section.id)}
                  >
                    <DeleteIcon sx={{ color: theme.palette.error.light }} />
                  </IconButton>
                </Tooltip>
              </Paper>
            ))}
          </Stack>

          {/* Delete Dialog */}
          <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>{"Confirm Delete"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this section?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                sx={{ color: theme.palette.text.primary }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                autoFocus
                sx={{ color: theme.palette.error.main }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Divider sx={{ my: 2 }}>OR</Divider>

        <Stack alignItems="center" sx={{ width: {xs:"100%", md:"80%"}, px: { xs: 2, sm: 3 }, m: "auto" }}>
          <Accordion
            expanded={isAccordionOpen}
            onChange={toggleAccordion}
            sx={{ width: "100%", maxWidth: { xs: "100%", md: 600 } }}
          >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: ".9rem", sm: "1.1rem" },
                }}
              >
                {update ? "Edit Carousel Section" : "Add New Carousel Section"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component="form"
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                noValidate
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (update) {
                    handleUpdateNewCarouselSectionClick();
                  } else {
                    handleNewCarouselSectionClick();
                  }
                }}
              >
                <FormControl
                  variant="outlined"
                  error={errors.newCarouselSection}
                  sx={{ width: "100%", maxWidth: { xs: "100%", lg: 400 } }}
                >
                  <Tooltip
                    title={
                      touched.newCarouselSection && errors.newCarouselSection
                        ? "This field is required."
                        : ""
                    }
                    arrow
                    open={
                      touched.newCarouselSection && errors.newCarouselSection
                    }
                    disableHoverListener={!errors.newCarouselSection}
                  >
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={newCarouselSection}
                      onChange={handleAddSectionChange}
                      autoComplete="off"
                      error={errors.newCarouselSection}
                      sx={{
                        width: "100%",
                        "& .MuiOutlinedInput-root": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#262626"
                              : "#D9D9D9",
                          color: theme.palette.text.primary,
                          border: "none",
                          height: { xs: "40px", sm: "45px" },
                          borderRadius: "10px",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </Tooltip>
                </FormControl>

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 4, mt: 2, justifyContent:"space-between"}}>
                  <Button
                    variant="contained"
                    onClick={
                      update
                        ? handleUpdateNewCarouselSectionClick
                        : handleNewCarouselSectionClick
                    }
                    sx={{
                      width: { xs: "100%", sm: "200px" },
                      backgroundColor: "#ee6c4d",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      textTransform: "capitalize",
                    }}
                  >
                    {update ? "Update Section" : "Add Section"}
                  </Button>
                  {update && (
                    <Button
                      variant="outlined"
                      onClick={handleCancelClick}
                      sx={{
                        width: { xs: "80%", sm: "120px" },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        borderColor: "#ee6c4d",
                        color: "#ee6c4d",
                        textTransform:"capitalize"
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage || "An error occurred"}
        </Alert>
      </Snackbar>
    </>
  );
}
