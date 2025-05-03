/*
- File Name: AllCarousel.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT ,
  MUI ,
  axios,
  react-router-dom ,
  AuthContext
  }
- Contributors:  rania rabie
- Last Modified Date: 4/22/2025
- Description :  display all Csrousel
*/

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../services/axiosInstance";

const AllCarousel = () => {
  const navigate = useNavigate();
  const [carousels, setCarousels] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCarouselId, setSelectedCarouselId] = useState(null);

  // const api = useAxios();

  const fetchCarouselData = () => {
    api
      .get(
        "/api/Dashboard/GetAllDetailsCarouselSection"
      )
      .then((response) => {
        setCarousels(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Carousel Sections:", error);
      });
  };

  useEffect(() => {
    fetchCarouselData();
  }, []);

  const handleCarouselClick = (id, carouselData) => {
    navigate(`/dashboard/newCarousel/${id}`, { state: carouselData });
  };

  const handleCreateNewCarousel = () => {
    navigate("/dashboard/newCarousel");
  };

  const handleOpenDialog = (id) => {
    setSelectedCarouselId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCarouselId(null);
  };

  const handleDelete = () => {
    if (selectedCarouselId) {
      api
        .delete(
          `/api/Dashboard/DeleteDetailsCarouselSection/${selectedCarouselId}`,
        )
        .then(() => {
          setCarousels((prevCarousels) =>
            prevCarousels.filter(
              (carousel) => carousel.id !== selectedCarouselId
            )
          );
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error deleting Carousel:", error);
          handleCloseDialog();
        });
    }
  };

  const theme = useTheme();
  return (
    <Box>
      <Typography
        component={"h2"}
        variant="h5"
        sx={{ my: 2, textAlign: "center" }}
      >
        All Carousels
      </Typography>
      <Stack spacing={2} alignItems={"center"}>
        {carousels.map((carousel) => (
          <Paper
            key={carousel.id}
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
              {carousel.carouselTitle}
              
            </Typography>

            <Tooltip title="Edit carousel">
              <IconButton
                aria-label="edit"
                onClick={() => handleCarouselClick(carousel.id, carousel)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Carousel">
              <IconButton
                aria-label="delete"
                onClick={() => handleOpenDialog(carousel.id)}
              >
                <DeleteIcon sx={{ color: theme.palette.error.light }} />{" "}
              </IconButton>
            </Tooltip>
          </Paper>
        ))}
      </Stack>
      <Button
        variant="contained"
        sx={{
          display: "block",
          m: "auto",
          mt: 4,
          mb: 2,
          textTransform: "capitalize",
          fontSize: "18px",
          backgroundColor: "#ee6c4d",
        }}
        onClick={handleCreateNewCarousel}
      >
        Create new carousel
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Carousel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: theme.palette.text.primary }}
          >
            {" "}
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            autoFocus
            sx={{ color: theme.palette.error.main }}
          >
            {" "}
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllCarousel;
