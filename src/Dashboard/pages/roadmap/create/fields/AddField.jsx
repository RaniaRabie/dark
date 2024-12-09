import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Tooltip,
  useTheme, Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

  const handleAddFieldClick = async () => {
    setTouched({ field: true });
    const hasErrors = validateFields();
    if (!hasErrors.field) {
      try {
        await axios.post("http://localhost:3001/categories", {
          fieldName: field,
        });
        setField("");
        navigate("/dashboard/allfields");
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
  };

  // Fetch the existing data if the path is for updating
  useEffect(() => {
    if (isUpdatePath && id) {
      axios
        .get(`http://localhost:3001/categories/${id}`)
        .then((response) => {
          setField(response.data.fieldName); // Populate field state with fetched data
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
        await axios.put(`http://localhost:3001/categories/${id}`, {
          fieldName: field,
        });
        setField("");
        navigate("/dashboard/allfields");
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  const handleAddFieldChange = (eo) => {
    setField(eo.target.value);
  };

  return (
    <>
        <Stack alignItems={"center"}>
          <Typography variant="h6" color= {theme.palette.text.primary}>Add New field</Typography>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1}}}
              noValidate
              autoComplete="off"
            >
              <FormControl variant="outlined" error={errors.field} sx={{ mt: 1 , display: "block"}}>
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
                    justifySelf:"center",
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
                      justifySelf:"center",
                      my: 2,
                      backgroundColor: "#ee6c4d",
                    }}
                >
                  Update Field
                </Button>
              )}
            </Box>
        </Stack >
    </>
  );
}
