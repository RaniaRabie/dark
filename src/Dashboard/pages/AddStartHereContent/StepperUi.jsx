import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import { useState } from "react";
import { FormControl, TextField, Tooltip, useTheme } from "@mui/material";
import { FormLabel } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StepConnector } from "@mui/material";
import axios from "axios";
const steps = [
  {
    label: "Page Intro",
  },
  {
    label: "Importance of Page",
  },
];

export default function StepperUi() {
  const [activeStep, setActiveStep] = React.useState(0);

  const [startHereTitle, setStartHereTitle] = useState("");
  const [startHereDescription, setStartHereDescription] = useState("");

  const [startHereImportanceTitle, setStartHereImportanceTitle] = useState("");
  const [startHereImportanceDescription, setStartHereImportanceDescription] = useState("");

  const [errors, setErrors] = useState({
    startHereTitle: false,
    startHereDescription: false,
    importanceTitle: false,
    startHereImportanceDescription: false,
  });

  const [touched, setTouched] = useState({
    startHereTitle: false,
    startHereDescription: false,
    importanceTitle: false,
    startHereImportanceDescription: false,
  });

  const theme = useTheme();

  const handleStartHereTitle = (e) => {
    setStartHereTitle(e.target.value);
    setErrors((prev) => ({ ...prev, startHereTitle: e.target.value === "" }));
    setTouched((prev) => ({ ...prev, startHereTitle: true }));
  };

  const handleStartHereDescription = (e) => {
    setStartHereDescription(e.target.value);
    setErrors((prev) => ({
      ...prev,
      startHereDescription: e.target.value === "",
    }));
    setTouched((prev) => ({ ...prev, startHereDescription: true }));
  };

  const handleStartHereImportanceTitle = (e) => {
    setStartHereImportanceTitle(e.target.value); 
    setErrors((prev) => ({ ...prev, importanceTitle: e.target.value === "" }));
    setTouched((prev) => ({ ...prev, importanceTitle: true }));
  };

  const handleStartHereImportanceDescription = (e) => {
    setStartHereImportanceDescription(e.target.value);
    setErrors((prev) => ({
      ...prev,
      startHereImportanceDescription: e.target.value === "",
    }));
    setTouched((prev) => ({ ...prev, startHereImportanceDescription: true }));
  };

  const handleNext = () => {
    // Validate Step 1 input
    if (activeStep === 0) {
      let isValid = true;

      // Check if the title is empty
      if (!startHereTitle.trim()) {
        setErrors((prev) => ({ ...prev, startHereTitle: true }));
        setTouched((prev) => ({ ...prev, startHereTitle: true }));
        isValid = false;
      }

      // Check if the description is empty
      if (!startHereDescription.trim()) {
        setErrors((prev) => ({ ...prev, startHereDescription: true }));
        setTouched((prev) => ({ ...prev, startHereDescription: true }));
        isValid = false;
      }

      if (!isValid) {
        return; // Prevent moving to the next step
      }
    }

    if (activeStep === 1) {
      let isValid = true;

      if (!startHereImportanceTitle.trim()) {
        setErrors((prev) => ({ ...prev, importanceTitle: true }));
        setTouched((prev) => ({ ...prev, importanceTitle: true }));
        isValid = false;
      }
      // Check if the description is empty
      if (!startHereImportanceDescription.trim()) {
        setErrors((prev) => ({
          ...prev,
          startHereImportanceDescription: true,
        }));
        setTouched((prev) => ({
          ...prev,
          startHereImportanceDescription: true,
        }));
        isValid = false;
      }

      if (!isValid) {
        return; // Prevent moving to the next step
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateFields = () => {
    const newErrors = {
      startHereTitle: startHereTitle === "",
      startHereDescription: startHereDescription === "",
      importanceTitle: startHereImportanceTitle === "",
      startHereImportanceDescription: startHereImportanceDescription === "",
    };

    setErrors(newErrors);
    return newErrors;
  };

  const handleClick = async () => {
    setTouched({
      startHereTitle: true,
      startHereDescription: true,
      importanceTitle: true,
      startHereImportanceDescription: true,
    });
    const hasErrors = validateFields();
    if (
      hasErrors.startHereTitle ||
      hasErrors.startHereDescription ||
      hasErrors.importanceTitle ||
      hasErrors.startHereImportanceDescription
    ) {
      return; // Prevent API call if there are errors
    }
    console.log("clicked");
    try {
      const response = await axios.post("http://localhost:3100/basicinfo", {
        startHereTitle: startHereTitle,
        startHereDescription: startHereDescription,
        startHereImportanceTitle: startHereImportanceTitle,
        startHereImportanceDescription: startHereImportanceDescription,
      });

      if (response.status === 200) {
        console.log("you can continue");
      }
    } catch (error) {
      console.error("Failed to check starthere details:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        connector={
          <StepConnector
            sx={{
              "& .MuiStepConnector-line": {
                stroke: "red", // Line color
                strokeWidth: 2, // Line thickness (optional)
              },
            }}
          />
        }
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                [`& .Mui-active .MuiStepIcon-root, & .Mui-completed .MuiStepIcon-root`]:
                  {
                    color: "#ee6c4d", // Default color
                  },
              }}
            >
              {step.label}
            </StepLabel>

            <StepContent>
              {index === 0 && (
                <Box
                  component="form"
                  sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                  noValidate
                  autoComplete="off"
                >
                  <FormLabel
                    sx={{
                      display: "block",
                      fontWeight: "400",
                      fontSize: "15px",
                      color: theme.palette.text.primary,
                      "&.MuiFormLabel-root": {
                        margin: 0,
                        padding: 0,
                      },
                    }}
                  >
                    Title
                  </FormLabel>

                  <FormControl variant="outlined" error={errors.startHereTitle}>
                    <Tooltip
                      title={
                        touched.startHereTitle && errors.startHereTitle
                          ? "This field is required."
                          : ""
                      }
                      arrow
                      open={touched.startHereTitle && errors.startHereTitle}
                      disableHoverListener={!errors.startHereTitle}
                    >
                      <span>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          value={startHereTitle}
                          onChange={handleStartHereTitle}
                          autoComplete="off"
                          error={errors.startHereTitle}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: theme.palette.text.primary,
                              border: "none",
                              width: "350px",
                              height: "45px",
                              borderRadius: "10px",
                              fontSize: "18px",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                              borderColor: "#ee6c4d", // Set the border color when the field is focused
                            },
                            "& .MuiOutlinedInput-root.Mui-error fieldset": {
                              borderColor: theme.palette.error.main, // Error state
                            },
                          }}
                        />
                      </span>
                    </Tooltip>
                  </FormControl>

                  <FormLabel
                    sx={{
                      display: "block",
                      fontWeight: "400",
                      fontSize: "15px",
                      color: theme.palette.text.primary,
                      "&.MuiFormLabel-root": {
                        margin: 0,
                        padding: 0,
                      },
                    }}
                  >
                    Description
                  </FormLabel>

                  <FormControl
                    variant="outlined"
                    error={errors.startHereDescription}
                    sx={{
                      mt: 1,
                      "& .MuiFormControl-root": {
                        margin: 0, // Removes margin
                        padding: 0,
                      },
                    }}
                  >
                    <Tooltip
                      title={
                        touched.startHereDescription &&
                        errors.startHereDescription
                          ? "This field is required."
                          : ""
                      }
                      arrow
                      open={
                        touched.startHereDescription &&
                        errors.startHereDescription
                      }
                      disableHoverListener={!errors.startHereDescription}
                    >
                      <span>
                        <TextField
                          id="outlined-multiline-flexible"
                          multiline
                          value={startHereDescription}
                          onChange={handleStartHereDescription}
                          error={errors.startHereDescription}
                          sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                              color: theme.palette.text.primary,
                              width: "350px",
                              minHeight: "130px",
                              borderRadius: "10px",
                              alignItems: "flex-start",
                              margin: 0,
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                              borderColor: "#ee6c4d", // Set the border color when the field is focused
                            },
                            "& .MuiOutlinedInput-root.Mui-error fieldset": {
                              borderColor: theme.palette.error.main, // Error state
                            },
                          }}
                        />
                      </span>
                    </Tooltip>
                  </FormControl>
                </Box>
              )}
              {index === 1 && (
                <Box
                  component="form"
                  sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                  noValidate
                  autoComplete="off"
                >
                  <FormLabel
                    sx={{
                      display: "block",
                      fontWeight: "400",
                      fontSize: "15px",
                      color: theme.palette.text.primary,
                      "&.MuiFormLabel-root": {
                        margin: 0,
                        padding: 0,
                      },
                    }}
                  >
                    Title
                  </FormLabel>

                  <FormControl
                    variant="outlined"
                    error={errors.importanceTitle}
                  >
                    <Tooltip
                      title={
                        touched.importanceTitle && errors.importanceTitle
                          ? "This field is required."
                          : ""
                      }
                      arrow
                      open={touched.importanceTitle && errors.importanceTitle}
                      disableHoverListener={!errors.importanceTitle}
                    >
                      <span>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          value={startHereImportanceTitle}
                          onChange={handleStartHereImportanceTitle}
                          autoComplete="off"
                          error={errors.importanceTitle}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              color: theme.palette.text.primary,
                              border: "none",
                              width: "350px",
                              height: "45px",
                              borderRadius: "10px",
                              fontSize: "18px",
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                              borderColor: "#ee6c4d", // Set the border color when the field is focused
                            },
                            "& .MuiOutlinedInput-root.Mui-error fieldset": {
                              borderColor: theme.palette.error.main, // Error state
                            },
                          }}
                        />
                      </span>
                    </Tooltip>
                  </FormControl>

                  <FormLabel
                    sx={{
                      display: "block",
                      fontWeight: "400",
                      fontSize: "15px",
                      color: theme.palette.text.primary,
                      "&.MuiFormLabel-root": {
                        margin: 0,
                        padding: 0,
                      },
                    }}
                  >
                    Description
                  </FormLabel>

                  <FormControl
                    variant="outlined"
                    error={errors.startHereImportanceDescription}
                    sx={{
                      mt: 1,
                      "& .MuiFormControl-root": {
                        margin: 0, // Removes margin
                        padding: 0,
                      },
                    }}
                  >
                    <Tooltip
                      title={
                        touched.startHereImportanceDescription &&
                        errors.startHereImportanceDescription
                          ? "This field is required."
                          : ""
                      }
                      arrow
                      open={
                        touched.startHereImportanceDescription &&
                        errors.startHereImportanceDescription
                      }
                      disableHoverListener={
                        !errors.startHereImportanceDescription
                      }
                    >
                      <span>
                        <TextField
                          id="outlined-multiline-flexible"
                          multiline
                          value={startHereImportanceDescription}
                          onChange={handleStartHereImportanceDescription}
                          error={errors.startHereImportanceDescription}
                          sx={{
                            mt: 1,
                            "& .MuiOutlinedInput-root": {
                              color: theme.palette.text.primary,
                              width: "350px",
                              minHeight: "130px",
                              borderRadius: "10px",
                              alignItems: "flex-start",
                              margin: 0,
                            },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                              borderColor: "#ee6c4d", // Set the border color when the field is focused
                            },
                            "& .MuiOutlinedInput-root.Mui-error fieldset": {
                              borderColor: theme.palette.error.main, // Error state
                            },
                          }}
                        />
                      </span>
                    </Tooltip>
                  </FormControl>
                </Box>
              )}

              <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{
                    mt: 1,
                    mr: 1,
                    textTransform: "capitalize",
                    color: "gray",
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={
                    index === steps.length - 1 ? handleClick : handleNext
                  } // Use handleClick for the last step
                  sx={{
                    mt: 1,
                    mr: 1,
                    textTransform: "capitalize",
                    backgroundColor: "#ee6c4d ",
                  }}
                >
                  {index === steps.length - 1 ? "Finish" : "Continue "}
                  {index === steps.length - 1 ? (
                    ""
                  ) : (
                    <ArrowForwardIcon fontSize="small" />
                  )}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
