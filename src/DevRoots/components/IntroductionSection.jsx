/*
- File Name: IntroductionSection.jsx
- Author: rania rabie
- Date of Creation: 16/4/2025
- Versions Information: 1.0.0
- Dependencies:
  {
    REACT,
    MUI,
    prop-types
  }
- Contributors: rania rabie
- Last Modified Date: 16/4/2025
- Description: A reusable Section component for displaying titled content with a styled divider
*/
import React from "react";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

// Styles for the Section component
const sectionStyles = {
  width: "100%",
  maxWidth: { xs: "100%", md: "800px", lg: "1100px" }, // Constrain width on larger screens
  padding: { xs: "16px", sm: "20px", md: "24px" }, // Responsive padding
  borderRadius: "10px",
  margin: { xs: "20px auto", sm: "30px auto", md: "40px auto" }, // Responsive margin
};

const circleStyle = {
  display: { xs: "none", sm: "block" },
  width: ".3em",
  height: ".3em",
  borderRadius: "50%",
  backgroundColor: "black",
  margin: "0px 5px",
};

export default function IntroductionSection({ title, content }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        ...sectionStyles,
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "5px 5px 15px rgba(0, 0, 0, 0.6)"
            : "5px 5px 10px rgba(227, 227, 227, 0.8)",
      }}
    >
      {!isMobile && (
        <Divider textAlign="center" sx={{ mb: { xs: 1.5, sm: 2 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              px: { xs: 1, sm: 2 },
            }}
          >
            <Box sx={circleStyle} />

            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.65rem" },
                // whiteSpace: "normal",
                textAlign: "center",
              }}
            >
              {" "}
              {title}
            </Typography>

            <Box sx={circleStyle} />
          </Box>
        </Divider>
      )}
      {isMobile && (
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.65rem" },
            // whiteSpace: "normal",
            textAlign: "center",
          }}
        >
          {" "}
          {title}
        </Typography>
      )}

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.primary,
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" }, // Responsive font size
          overflowWrap: "break-word", // Handle long words
          wordBreak: "break-word", // Prevent overflow
        }}
      >
        {" "}
        {content}
      </Typography>
    </Box>
  );
}
// PropTypes for type checking
IntroductionSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
