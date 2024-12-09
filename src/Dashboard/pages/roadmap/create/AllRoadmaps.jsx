/*
- File Name: AllRoadmaps.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT ,
  MUI ,
  axios,
  react-router-dom ,
  }
- Contributors:  rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description :  display all roadmaps
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoadIcon from "@mui/icons-material/EditRoad";
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

const AllRoadmaps = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://careerguidance.runasp.net/api/Dashboard/GetALlRoadmapsInDatabase"
      )
      .then((response) => {
        const parsedRoadmaps = response.data.map((roadmap) => {
          if (typeof roadmap.roadmapData === "string") {
            roadmap.roadmapData = JSON.parse(roadmap.roadmapData);
          }
          return roadmap;
        });
        setRoadmaps(parsedRoadmaps);
      })
      .catch((error) => {
        console.error("Error fetching roadmaps:", error);
      });
  }, []);

  const handleNodeClick = (id, roadmapData) => {
    navigate(`/dashboard/details/${id}`, { state: roadmapData });
  };

  const handleCreateNewRoadmap = () => {
    navigate("/dashboard/details");
  };

  const handleOpenDialog = (id) => {
    setSelectedRoadmapId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedRoadmapId(null);
  };

  const handleDelete = () => {
    if (selectedRoadmapId) {
      axios
        .delete(
          `https://careerguidance.runasp.net/api/Dashboard/Delete/${selectedRoadmapId}`
        )
        .then(() => {
          setRoadmaps((prevNodes) =>
            prevNodes.filter((node) => node.id !== selectedRoadmapId)
          );
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error deleting roadmap:", error);
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
        All Roadmaps
      </Typography>
      <Stack spacing={2} alignItems={"center"}>
        {roadmaps.map((roadmap) => (
          <Paper
            key={roadmap.id}
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
              {roadmap.roadmapData.roadmapName}
            </Typography>

            <Tooltip title="Edit roadmap">
              <IconButton
                aria-label="edit"
                onClick={() => handleNodeClick(roadmap.id, roadmap.roadmapData)}
              >
                <EditRoadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete roadmap">
              <IconButton
                aria-label="delete"
                onClick={() => handleOpenDialog(roadmap.id)}
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
        onClick={handleCreateNewRoadmap}
      >
        Create new Roadmap
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this roadmap?
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

export default AllRoadmaps;
