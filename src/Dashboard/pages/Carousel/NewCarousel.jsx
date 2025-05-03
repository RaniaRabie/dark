/*
- File Name: NewCarousel.jsx
- Author: Rania Rabie
/- Date of Creation: 17/12/2024
- Versions Information: 1.0.0
- Dependencies:
  {
    REACT,
    MUI,
    react-router-dom, 
    axiosو
    AuthContext
  }
- Contributors: rania rabie
- Last Modified Date: 4/22/2025
- Description : Create New Carousel
*/

import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  Tooltip,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../../../services/axiosInstance";

const buttonStyle ={
    width: "180px",
    display: "block",
    m: "auto",
    my: 2,
    backgroundColor: "#ee6c4d",
    textTransform: "capitalize"
}

export default function NewCarousel() {
  const [selectCarouselSection, setSelectCarouselSection] = useState("");
  const [carouselState, setCarouselState] = useState("");
  const [carouselTitle, setCarouselTitle] = useState("");
  const [carouselDes, setCarouselDes] = useState("");
  const [carouselImg, setCarouselImg] = useState("");
  const [carouselUrl, setCarouselUrl] = useState("");

  const [createdCarouselSections, setCreatedCarouselSections] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [errors, setErrors] = useState({
    selectCarouselSection: false,
    // carouselState: false,
    carouselTitle: false,
    carouselDes: false,
    carouselImg: false,
    carouselUrl: false,
  });
  const [touched, setTouched] = useState({
    selectCarouselSection: false,
    // carouselState: false,
    carouselTitle: false,
    carouselDes: false,
    carouselImg: false,
    carouselUrl: false,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const api = useAxios();
  useEffect(() => {
    const fetchCarouselSections = async () => {
      try {
        const response = await api.get("/api/Dashboard/GetAllCarouselSection");
         // console.log("🎯 Carousel Sections fetched:", response.data); 
        setCreatedCarouselSections(response.data);
      } catch (error) {
        console.error("❌ Error fetching Carousel Sections:", error);
      }
    };
  
    fetchCarouselSections();
  }, []);

  const updateCarousel = async () => {
    try {
      // Ensure `id` and `updatedCarouselData` are defined
      // if (!id) {
      //   console.error("No ID provided for update.");
      //   return;
      // }

      const updatedCarouselData = {
        carouselSection: selectCarouselSection,
        carouselState,
        carouselTitle,
        carouselDes,
        carouselImg,
        carouselUrl,
      };
      // console.log("Sending data:", updatedCarouselData)

      // Make the PUT request with data
      await api.put(
        `/api/Dashboard/UpdateDetailsCarouselSection/${id}`,
        updatedCarouselData,
      );

      // console.log("Carousel updated successfully.");
      navigate("/dashboard/allCarousel");
    } catch (error) {
      console.error("Error updating carousel:", error);

      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data?.errors?.[1] || "An unexpected error occurred.";

        if (status === 400 || status === 409 || status === 401) {
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } else {
        setErrorMessage("Network error or server unreachable.");
      }

      setOpenSnackbar(true);
    }
  };

  const validateFields = () => {
    const newErrors = {
      selectCarouselSection: selectCarouselSection === "",
      // carouselState: carouselState === "",
      carouselTitle: carouselTitle === "",
      carouselDes: carouselDes === "",
      carouselImg: carouselImg === "",
      carouselUrl: carouselUrl === "",
    };

    setErrors(newErrors);
    return newErrors;
  };

  const handleCreateClick = async () => {
    setTouched({
      selectCarouselSection: true,
      // carouselState: true,
      carouselTitle: true,
      carouselDes: true,
      carouselImg: true,
      carouselUrl: true,
    });
    const hasErrors = validateFields();

    if (
      !hasErrors.selectCarouselSection &&
      // !hasErrors.carouselState &&
      !hasErrors.carouselTitle &&
      !hasErrors.carouselDes &&
      !hasErrors.carouselImg &&
      !hasErrors.carouselUrl
    ) {
      const requestBody = {
        carouselSection: selectCarouselSection,
        carouselState: carouselState,
        carouselTitle: carouselTitle,
        carouselDes: carouselDes,
        carouselImg: carouselImg,
        carouselUrl: carouselUrl,
      };

      // console.log("🚀 Request body being sent to backend:", requestBody);
      try {
        await api.post(
          "/api/Dashboard/AddDetailsCarouselSection",
          requestBody,
        );
        navigate("/dashboard/allCarousel")
      } catch (error) {
        console.error("Failed to add Carousel Section data:", error);
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

  const handleCarouselSectionChange = (e) => {
    setSelectCarouselSection(e.target.value);
    setErrors((prev) => ({
      ...prev,
      selectCarouselSection: e.target.value === "",
    }));
  };

  const handleCarouselStateChange = (e) => {
    setCarouselState(e.target.value);
    setErrors((prev) => ({ ...prev, carouselState: e.target.value === "" }));
  };

  const handleCarouselTitleChange = (e) => {
    setCarouselTitle(e.target.value);
    setErrors((prev) => ({ ...prev, carouselTitle: e.target.value === "" }));
  };

  const handleCarouselDesChange = (e) => {
    setCarouselDes(e.target.value);
    setErrors((prev) => ({ ...prev, carouselDes: e.target.value === "" }));
  };

  const handleCarouselImgChange = (e) => {
    setCarouselImg(e.target.value);
    setErrors((prev) => ({ ...prev, carouselImg: e.target.value === "" }));
  };
  
  const handleCarouselUrlChange = (e) => {
    setCarouselUrl(e.target.value);
    setErrors((prev) => ({ ...prev, carouselUrl: e.target.value === "" }));
  };

  const handleUpdateCarousel = async () => {
    setTouched({
      selectCarouselSection: true,
      // carouselState: true,
      carouselTitle: true,
      carouselDes: true,
      carouselImg: true,
      carouselUrl: true,
    });
    const hasErrors = validateFields();
    if (
      !hasErrors.selectCarouselSection &&
      // !hasErrors.carouselState &&
      !hasErrors.carouselTitle &&
      !hasErrors.carouselDes &&
      !hasErrors.carouselImg &&
      !hasErrors.carouselUrl
    ) {
      await updateCarousel();
    }
  };

  useEffect(() => {
    setSelectCarouselSection("");
    setCarouselState("");
    setCarouselTitle("");
    setCarouselDes("");
    setCarouselImg("");
    setCarouselUrl("");
    if (location.state) {
      const {
        carouselSection,
        carouselState,
        carouselTitle,
        carouselDes,
        carouselImg,
        carouselUrl,
      } = location.state;

      setSelectCarouselSection(carouselSection || "");
      setCarouselState(carouselState || "");
      setCarouselTitle(carouselTitle || "");
      setCarouselDes(carouselDes || "");
      setCarouselImg(carouselImg || "");
      setCarouselUrl(carouselUrl || "");
    }
  }, [
    location.state,
    setSelectCarouselSection,
    setCarouselState,
    setCarouselTitle,
    setCarouselDes,
    setCarouselImg,
    setCarouselUrl,
  ]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  const isCreatePath = location.pathname === "/dashboard/newCarousel";
  const isUpdatePath = location.pathname.startsWith("/dashboard/newCarousel/");

  const theme = useTheme();
  return (
    <Box sx={{ width: "80%", m: "auto", mt: 2 }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Carousel Section Select */}
        <Box sx={{ mb: 2 }}>
          <label className="roadmapCategory">Carousel Section</label>
          <br />
          <FormControl
            variant="outlined"
            error={errors.selectCarouselSection}
            sx={{ mt: 1 }}
          >
            <Tooltip
              title={
                touched.selectCarouselSection && errors.selectCarouselSection
                  ? "This field is required."
                  : ""
              }
              arrow
              open={
                touched.selectCarouselSection && errors.selectCarouselSection
              }
              disableHoverListener={!errors.selectCarouselSection}
            >
              <span>
                <Select
                  labelId="roadmap-category-label"
                  value={selectCarouselSection}
                  onChange={handleCarouselSectionChange}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#262626" : "#D9D9D9",
                    color: theme.palette.text.primary,
                    borderRadius: "10px",
                    width: "350px",
                    height: "45px",
                  }}
                >
                  <MenuItem value="">Select a Carousel Section</MenuItem>
                  {createdCarouselSections.map((section) => (
                    <MenuItem
                      key={section.id}
                      value={section.newCarouselSection}
                    >
                      {section.newCarouselSection}
                    </MenuItem>
                  ))}
                </Select>
              </span>
            </Tooltip>
          </FormControl>
        </Box>

        {/* Carousel State Select */}
        <Box sx={{ mb: 2 }}>
          <label className="roadmapCategory">Carousel State</label>
          <br />
          <FormControl
            variant="outlined"
            // error={errors.carouselState}
            sx={{ mt: 1 }}
          >
            {/* <Tooltip
              title={
                touched.carouselState && errors.carouselState
                  ? "This field is required."
                  : ""
              }
              arrow
              open={touched.carouselState && errors.carouselState}
              disableHoverListener={!errors.carouselState}
            > */}
              <span>
                <Select
                  labelId="roadmap-category-label"
                  value={carouselState}
                  onChange={handleCarouselStateChange}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#262626" : "#D9D9D9",
                    color: theme.palette.text.primary,
                    borderRadius: "10px",
                    width: "350px",
                    height: "45px",
                  }}
                >
                  <MenuItem value="">Select Carousel State</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Trending">Trending</MenuItem>
                  <MenuItem value="Updated">Updated</MenuItem>
                </Select>
              </span>
            {/* </Tooltip> */}
          </FormControl>
        </Box>

        {/* Carousel Title */}
        <Box>
          <label className="roadmapName">Carousel Title</label>
          <br />
          <FormControl
            variant="outlined"
            error={errors.carouselTitle}
            sx={{ mt: 1 }}
          >
            <Tooltip
              title={
                touched.carouselTitle && errors.carouselTitle
                  ? "This field is required."
                  : ""
              }
              arrow
              open={touched.carouselTitle && errors.carouselTitle}
              disableHoverListener={!errors.carouselTitle}
            >
              <span>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={carouselTitle}
                  onChange={handleCarouselTitleChange}
                  autoComplete="off"
                  error={errors.carouselTitle}
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
        </Box>

        {/* Carousel Description */}
        <Box sx={{ my: 2 }}>
          <label className="roadmapName">Carousel Description</label>
          <br />
          <FormControl
            variant="outlined"
            error={errors.carouselDes}
            sx={{ mt: 1 }}
          >
            <Tooltip
              title={
                touched.carouselDes && errors.carouselDes
                  ? "This field is required."
                  : ""
              }
              arrow
              open={touched.carouselDes && errors.carouselDes}
              disableHoverListener={!errors.carouselDes}
            >
              <span>
                <TextField
                  id="outlined-multiline-flexible"
                  multiline
                  value={carouselDes}
                  onChange={handleCarouselDesChange}
                  error={errors.carouselDes}
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#262626" : "#D9D9D9",
                      color: theme.palette.text.primary,
                      width: "350px",
                      minHeight: "130px",
                      borderRadius: "10px",
                      alignItems: "flex-start",
                    },
                  }}
                />
              </span>
            </Tooltip>
          </FormControl>
        </Box>

        {/* Image URL */}
        <Box>
          <label className="roadmapImageUrl">Carousel Image URL</label>
          <br />
          <FormControl
            variant="outlined"
            error={errors.carouselImg}
            sx={{ mt: 1 }}
          >
            <Tooltip
              title={
                touched.carouselImg && errors.carouselImg
                  ? "This field is required."
                  : ""
              }
              arrow
              open={touched.carouselImg && errors.carouselImg}
              disableHoverListener={!errors.carouselImg}
            >
              <span>
                <TextField
                  id="outlined-image-url"
                  variant="outlined"
                  placeholder="Paste image URL here"
                  value={carouselImg}
                  onChange={handleCarouselImgChange}
                  error={errors.carouselImg}
                  sx={{
                    my: 1,
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
        </Box>

        {/* Image Preview */}
        {carouselImg && (
          <Box>
            <img
              src={carouselImg}
              alt="Preview"
              width="200"
              style={{ display: "block", margin: "auto" }}
            />
          </Box>
        )}

        <Box>
          <label className="roadmapImageUrl">Carousel URL</label>
          <br />
          <FormControl
            variant="outlined"
            error={errors.carouselUrl}
            sx={{ mt: 1 }}
          >
            <Tooltip
              title={
                touched.carouselUrl && errors.carouselUrl
                  ? "This field is required."
                  : ""
              }
              arrow
              open={touched.carouselUrl && errors.carouselUrl}
              disableHoverListener={!errors.carouselUrl}
            >
              <span>
                <TextField
                  id="outlined-image-url"
                  variant="outlined"
                  placeholder="Paste image URL here"
                  value={carouselUrl}
                  onChange={handleCarouselUrlChange}
                  error={errors.carouselUrl}
                  sx={{
                    my: 1,
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
        </Box>

        {/* Buttons */}
        {isCreatePath && (
          <Button
            variant="contained"
            onClick={handleCreateClick}
            sx={buttonStyle}
          >
            Create
          </Button>
        )}
        {isUpdatePath && (
          <Button
            onClick={handleUpdateCarousel}
            variant="contained"
            sx={buttonStyle}          >
            Update
          </Button>
        )}
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
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
