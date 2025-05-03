/*
- File Name: AddField.jsx
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
- Description : add new fields
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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../services/axiosInstance";

export default function AddField() {
  const location = useLocation();
  const { id } = useParams(); // Get the ID from the URL parameters for update
  const [field, setField] = useState("");
  const [errors, setErrors] = useState({
    field: false,
  });
  const [touched, setTouched] = useState({
    field: false,
  });

  const navigate = useNavigate();
  const theme = useTheme();

  const isCreatePath = location.pathname === "/dashboard/addfield";
  const isUpdatePath = location.pathname.startsWith("/dashboard/addfield/");

  const validateFields = () => {
    const newErrors = {
      field: field === "",
    };

    setErrors(newErrors);
    return newErrors;
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleAddFieldClick = async () => {
    setTouched({ field: true });
    const hasErrors = validateFields();
    if (!hasErrors.field) {
      try {
        await api.post(
          "/api/Dashboard/AddRoadmapCategory",
          {
            roadmapCategory: field,
          },
        );
        setField("");
        navigate("/dashboard/allfields");
      } catch (error) {
        console.error("Error sending data:", error);
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

  // Fetch the existing data if the path is for updating
  useEffect(() => {
    if (isUpdatePath && id) {
      api
        .get(
          `/api/Dashboard/GetCategory/${id}`
        )
        .then((response) => {
          setField(response.data.category); // Populate field state with fetched data
        })

        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isUpdatePath, id]);

  const handleUpdateFieldClick = async () => {
    setTouched({ field: true });
    const hasErrors = validateFields();
    if (!hasErrors.field) {
      try {
        await api.put(
          `/api/Dashboard/UpdateRoadmapCategory/${id}`,
          {
            roadmapCategory: field,
          },
        );
        setField("");
        navigate("/dashboard/allfields");
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
    setField(eo.target.value);
    setErrors((prev) => ({ ...prev, field: eo.target.value === "" }));

  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };
  return (
    <>
      <Stack alignItems={"center"}>
        <Typography variant="h6" color={theme.palette.text.primary}>
          Add New field
        </Typography>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1 } }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault(); // Prevents the default page reload
            if (isCreatePath) {
              handleAddFieldClick(); // Submit logic for create
            } else if (isUpdatePath) {
              handleUpdateFieldClick(); // Submit logic for update
            }
          }}
        >
          <FormControl
            variant="outlined"
            error={errors.field}
            sx={{ mt: 1, display: "block" }}
          >
            <Tooltip
              title={
                touched.field && errors.field ? "This field is required." : ""
              }
              arrow
              open={touched.field && errors.field}
              disableHoverListener={!errors.field}
            >
              <span>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={field}
                  onChange={handleAddFieldChange}
                  autoComplete="off"
                  error={errors.field}
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
              onClick={handleAddFieldClick}
              sx={{
                width: "200px",
                display: "block",
                justifySelf: "center",
                my: 2,
                backgroundColor: "#ee6c4d",
              }}
            >
              Add Field
            </Button>
          )}
          {isUpdatePath && (
            <Button
              onClick={handleUpdateFieldClick}
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
