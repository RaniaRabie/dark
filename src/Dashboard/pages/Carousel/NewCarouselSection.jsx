/*
- File Name: newCarouselSection.jsx
- Author: Rania Rabie
- Date of Creation: 17/12/2024
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
- Description : add new Carousel Section
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
  } from "@mui/material";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { useLocation, useNavigate, useParams } from "react-router-dom";
  
export default function NewCarouselSection() {
    const location = useLocation();
    const { id } = useParams(); // Get the ID from the URL parameters for update
    const [newCarouselSection, setNewCarouselSection] = useState("");
    const [errors, setErrors] = useState({
        newCarouselSection: false,
    });
    const [touched, setTouched] = useState({
        newCarouselSection: false,
    });
  
    const navigate = useNavigate();
    const theme = useTheme();
  
    const isCreatePath = location.pathname === "/dashboard/newCarouselSection";
    const isUpdatePath = location.pathname.startsWith("/dashboard/newCarouselSection/");
  
    const validateFields = () => {
      const newErrors = {
        newCarouselSection: newCarouselSection === "",
      };
  
      setErrors(newErrors);
      return newErrors;
    };
  
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleNewCarouselSectionClick = async () => {
      setTouched({ newCarouselSection: true });
      const hasErrors = validateFields();
      if (!hasErrors.newCarouselSection) {
        try {
          await axios.post(
            "http://localhost:3100/newCarouselSection",
            {
                newCarouselSection: newCarouselSection,
            }
          );
          setNewCarouselSection("");
        //   navigate("/dashboard/allfields");
        } catch (error) {
          console.error("Error sending data:", error);
          if (
            (error.response && error.response.status === 400) ||
            (error.response && error.response.status === 409) ||
            (error.response && error.response.status === 401)
          ) {
            const errorMessage = error.response.data;
            setErrorMessage(errorMessage);
          } else {
            setErrorMessage("An unexpected error occurred.");
          }
          setOpenSnackbar(true);
        }
      }
    };
  
    // Fetch the existing data if the path is for updating
    useEffect(() => {
      if (isUpdatePath && id) {
        axios
          .get(
            `https://careerguidance.runasp.net/api/Dashboard/GetCategory/${id}`
          )
          .then((response) => {
            setNewCarouselSection(response.data.newCarouselSection); // Populate field state with fetched data
          })
  
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }, [isUpdatePath, id]);
  
    const handleUpdateNewCarouselSectionClick = async () => {
      setTouched({ newCarouselSection: true });
      const hasErrors = validateFields();
      if (!hasErrors.field) {
        try {
          await axios.put(
            `https://careerguidance.runasp.net/api/Dashboard/UpdateRoadmapCategory/${id}`,
            {
                newCarouselSection: newCarouselSection,
            }
          );
          setNewCarouselSection("");
        //   navigate("/dashboard/allfields");
        } catch (error) {
          console.error("Error updating data:", error);
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
        }
        setOpenSnackbar(true);
      }
    };
  
    const handleAddFieldChange = (eo) => {
      setNewCarouselSection(eo.target.value);
      setErrors((prev) => ({ ...prev, newCarouselSection: eo.target.value === "" }));

    };
  
    const handleCloseSnackbar = () => {
      setOpenSnackbar(false); // Close the Snackbar
    };
  return (
    <>
      <Stack alignItems={"center"}>
        <Typography variant="h6" color={theme.palette.text.primary}>
          Add New Carousel Section
        </Typography>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault(); // Prevents the default page reload
            if (isCreatePath) {
              handleNewCarouselSectionClick(); // Submit logic for create
            } else if (isUpdatePath) {
              handleUpdateNewCarouselSectionClick(); // Submit logic for update
            }
          }}
        >
          <FormControl
            variant="outlined"
            error={errors.newCarouselSection}
            sx={{ mt: 1, display: "block" }}
          >
            <Tooltip
              title={
                touched.newCarouselSection && errors.newCarouselSection ? "This field is required." : ""
              }
              arrow
              open={touched.newCarouselSection && errors.newCarouselSection}
              disableHoverListener={!errors.newCarouselSection}
            >
              <span>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={newCarouselSection}
                  onChange={handleAddFieldChange}
                  autoComplete="off"
                  error={errors.newCarouselSection}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#262626" : "#D9D9D9",
                      color: theme.palette.text.primary,
                      border: "none",
                      width: "350px",
                      height: "45px",
                      borderRadius: "10px",
                      fontSize: "18px",
                    },
                  }}
                />
              </span>
            </Tooltip>
          </FormControl>

          {/* Buttons */}
          {isCreatePath && (
            <Button
              variant="contained"
              onClick={handleNewCarouselSectionClick}
              sx={{
                width: "200px",
                display: "block",
                justifySelf: "center",
                my: 2,
                backgroundColor: "#ee6c4d",
              }}
            >
              Add Section
            </Button> 
          )}
          {isUpdatePath && (
            <Button
              onClick={handleUpdateNewCarouselSectionClick}
              variant="contained"
              sx={{
                width: "200px",
                display: "block",
                justifySelf: "center",
                my: 2,
                backgroundColor: "#ee6c4d",
              }}
            >
              Update Field
            </Button>
          )}
        </Box>
        
      </Stack>
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
            {errorMessage}
          </Alert>
        </Snackbar>
    </>
  );
}

