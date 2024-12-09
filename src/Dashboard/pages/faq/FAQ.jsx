/*
- File Name: FAQ.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : FAQ 
*/
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const FAQ = () => {
  const theme = useTheme(); // استخدام الثيم للوضع الحالي
  const [showInputFields, setShowInputFields] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [faqData, setFaqData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [dialogOpen, setDialogOpen] = useState(false); // Control for delete confirmation dialog
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null); // Track the FAQ to delete

  useEffect(() => {
    // Fetch existing FAQs from the backend
    const fetchFAQs = async () => {
      try {
        const response = await fetch(
          "https://careerguidance.runasp.net/api/Dashboard/GetAllQuestions"
        );
        const data = await response.json();
        setFaqData(data); // Assuming the response is an array of FAQs
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFAQs();
  }, []);

  const handleAddNewQuestion = () => {
    setShowInputFields(true);
  };

  const handlePublish = async () => {
    if (newQuestion && newAnswer) {
      try {
        const response = await fetch(
          "https://careerguidance.runasp.net/api/Dashboard/AddQuestion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.errors && errorData.errors.length > 0
              ? errorData.errors[1]
              : "Failed to add question";
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        // Fetch updated FAQ list
        const newResponse = await fetch(
          "https://careerguidance.runasp.net/api/Dashboard/GetAllQuestions"
        );
        const data = await newResponse.json();
        setFaqData(data);

        setSnackbarMessage("Question added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setNewQuestion(""); // Clear fields
        setNewAnswer("");
        setShowInputFields(false); // Hide input fields
      } catch (error) {
        console.error("Error adding question:", error);
        setSnackbarMessage("Error adding question");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteConfirmation = (index) => {
    setSelectedDeleteIndex(index);
    setDialogOpen(true); // Open the dialog
  };

  const handleDelete = async () => {
    const index = selectedDeleteIndex;
    const faqToDelete = faqData[index];

    try {
      const response = await fetch(
        `https://careerguidance.runasp.net/api/Dashboard/DeleteQuestion/${faqToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        setFaqData(faqData.filter((_, i) => i !== index));
        setSnackbarMessage("Question deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.errors && errorData.errors.length > 1
            ? errorData.errors[1]
            : "Failed to delete question";

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setSnackbarMessage("Error deleting question");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setDialogOpen(false); // Close the dialog
    setSelectedDeleteIndex(null); // Reset selection
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditQuestion(faqData[index].question);
    setEditAnswer(faqData[index].answer);
  };

  const handleSave = async (index) => {
    const faqToUpdate = faqData[index];
    const updatedFaq = { question: editQuestion, answer: editAnswer };

    try {
      const response = await fetch(
        `https://careerguidance.runasp.net/api/Dashboard/UpdateQuestion/${faqToUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFaq),
        }
      );

      if (response.ok) {
        const updatedFaqs = faqData.map((faq, i) =>
          i === index
            ? { ...faq, question: editQuestion, answer: editAnswer }
            : faq
        );
        setFaqData(updatedFaqs);
        setEditIndex(null);
        setEditQuestion("");
        setEditAnswer("");

        setSnackbarMessage("Question updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.errors && errorData.errors.length > 0
            ? errorData.errors[1]
            : "Failed to update question";

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setSnackbarMessage("Error updating question");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "inherit",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#293241",
          fontSize: "30px",
        }}
      >
        Frequently Asked Questions
      </Typography>

      {faqData.map((faq, index) => (
        <Accordion
          key={index}
          sx={{
            mb: 1,
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f7f7f7",
            borderRadius: 1,
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                }}
              />
            }
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            {editIndex === index ? (
              <>
                <TextField
                  fullWidth
                  label="Edit Question"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  sx={{
                    mb: 1,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#444" : "inherit",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  }}
                />
                <TextField
                  fullWidth
                  label="Edit Answer"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  sx={{
                    mb: 1,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#444" : "inherit",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  }}
                />
              </>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                }}
              >
                {faq.question}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            {editIndex === index ? (
              <Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave(index)}
                  sx={{
                    mr: 1,
                    color: "#fff"
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  sx={{
                    mr: 1,
                    color: "#fff",
                    backgroundColor:"#ee6c4d"
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Typography
                sx={{
                  color: theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                }}
              >
                {faq.answer}
              </Typography>
            )}

            {editIndex !== index && (
              <Box sx={{ mt: 2 }}>
                <IconButton onClick={() => handleEdit(index)} color="primary">
                  <EditIcon
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "#3d5a80"
                          : "primary.main",
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteConfirmation(index)}
                  color="error"
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#ee6c4d" : "error.main",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      <Grid item xs={12}>
        <Card
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#333" : "#ffffff",
          }}
        >
          <CardContent>
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleAddNewQuestion}
                sx={{
                  mr: 2,
                  mb: 2,
                  backgroundColor: "#ee6c4d",
                  fontWeight: "bold",
                  fontSize: "15px",
                  textTransform: "capitalize",
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(34, 31, 31, 0.3)",
                  transition: " 0.5s ease",
                  "&:hover": {
                    backgroundColor: "#ee6c4d", // Change background color on hover
                  },
                }}
              >
                Add new question
              </Button>
            </Box>

            {showInputFields && (
              <Box>
                <TextField
                  fullWidth
                  label="New Question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  sx={{
                    mb: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#444" : "inherit",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  }}
                />
                <TextField
                  fullWidth
                  label="New Answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  sx={{
                    mb: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#444" : "inherit",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "inherit",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handlePublish}
                  sx={{
                    mr: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#ee6c4d" : "#ee6c4d",
                    color:
                      theme.palette.mode === "dark" ? "#ffffff" : "#ffffff",
                    "&:hover": { backgroundColor: "#ee6c4d" },
                  }}
                >
                  Publish
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for deletion */}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="delete-confirmation-dialog"
        sx={{
          "& .MuiDialog-paper": {
            // backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f9f9f9", // Background color for the dialog box
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)", // Adding shadow to the dialog
            borderRadius: 4, // Rounded corners
            padding: "16px", // Padding around the content
          },
        }}
      >
        <DialogTitle
          id="delete-confirmation-dialog"
          sx={{
            // color: theme.palette.mode === "dark" ? "#ffffff" : "#293241", // White text for the title
            padding: "16px", // Padding around the title
            borderTopLeftRadius: 4, // Ensuring top corners are rounded
            borderTopRightRadius: 4,
            fontWeight: "bold",
          }}
        >
          Delete Question
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "16px 24px", // Padding for the content area
            // backgroundColor: theme.palette.mode === "dark" ? "#444" : "#f9f9f9", // Keeping the background consistent
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: theme.palette.text.primary, // Muted color for the message text
              marginBottom: "16px", // Spacing below the text
            }}
          >
            Are you sure you want to delete this question?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "8px 24px", // Spacing around the buttons
            justifyContent: "flex-end", // Align buttons to the right
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              textTransform: "none", // Remove uppercase transformation
              fontWeight: 500, // Slightly bolder font for buttons
              color: theme.palette.mode === "dark" ? "#cfd8dc" : "#3d5a80",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: theme.palette.mode === "dark" ? "#ff8a65" : "#ee6c4d",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FAQ;
