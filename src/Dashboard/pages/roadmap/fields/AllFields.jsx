/*
- File Name: AllFields.jsx
- Author: Rania Rabie
- Date of Creation: 20/11/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom,
  }
- Contributors: shrouk ahmed , rania rabie, nourhan khaled
- Last Modified Date: 10/12/2024
- Description : show all fields
*/
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../../../../services/axiosInstance";



export default function AllFields() {
  const navigate = useNavigate();

  const handleCreateNewFieldClick = (eo) => {
    navigate("/dashboard/addfield");
  };

  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  // const api = useAxios();

  useEffect(() => {
    api
      .get(
        "/api/Dashboard/GetAllCategoryInDatabase"
      )
      .then((response) => {
        setFields(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fields:", error);
      });
  }, [api]);

  const handleFieldClick = (id, fieldName) => {
    navigate(`/dashboard/addfield/${id}`, { state: fieldName });
  };

  const handleOpenDialog = (id) => {
    setSelectedFieldId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFieldId(null);
  };

  const handleDelete = () => {
    if (selectedFieldId) {
      api
        .delete(
          `/api/Dashboard/DeleteRoadmapCategory/${selectedFieldId}`,
        )
        .then(() => {
          setFields((prevFields) =>
            prevFields.filter((field) => field.id !== selectedFieldId)
          );
          handleCloseDialog();
        })
        .catch((error) => {
          console.error("Error deleting field:", error);
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
        All Fields
      </Typography>
      <Stack spacing={2} alignItems={"center"}>
        {fields.map((field) => (
          <Paper
            key={field.id}
            elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "90%", md: "50%" },
              py: 1,
              px: 2,
            }}
          >
            <Typography sx={{ flexGrow: 1 }}>{field.category}</Typography>

            <Tooltip title="Edit field">
              <IconButton
                aria-label="edit"
                onClick={() => handleFieldClick(field.id, field)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete field">
              <IconButton
                aria-label="delete"
                onClick={() => handleOpenDialog(field.id)}
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
        onClick={handleCreateNewFieldClick}
      >
        Create new Field
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this field?
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
}
