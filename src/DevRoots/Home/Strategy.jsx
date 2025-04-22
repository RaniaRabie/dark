import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import PropTypes from "prop-types";

export default function Strategy() {
    return (
        <Box
          sx={{
            width: { xs: "90%", sm: "80%" }, // Wider on mobile
            margin: "auto",
            minHeight: { xs: "auto", md: "100vh" }, // Dynamic height
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Stack on mobile
            alignItems: "center",
            gap: { xs: 3, sm: 5, md: 6 }, // Responsive gap
            py: { xs: 4, sm: 6 }, // Vertical padding
          }}
        >
          {/* Strategy Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Header */}
            <Box>
              <Typography
                variant="h2"
                sx={{
                  textTransform: "capitalize",
                  fontSize: {
                    xs: "clamp(1.5rem, 6vw, 1.8rem)",
                    sm: "2rem",
                    md: "2.2rem",
                  },
                  fontWeight: "bold",
                }}
              >
                Aims & Objectives
              </Typography>
              <Box
                sx={{
                  width: { xs: 60, sm: 80 },
                  height: 4,
                  backgroundColor: "#ee6d4f",
                  borderRadius: 10,
                  mt: 1,
                  mb: { xs: 2, sm: 3 },
                }}
              />
            </Box>
    
            {/* Description */}
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                textAlign: "justify",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              Develop an interactive Career Guidance platform tailored for Arab’s
              individuals who are just starting their career journey. The platform
              will simplify the learning process by providing structured roadmaps,
              essential foundational knowledge, and practical resources to help users
              confidently begin and progress in their chosen tracks.
            </Typography>
    
            {/* Check Items */}
            {[
              "Provide Clear Learning Roadmaps.",
              "Focus on Essential Fundamentals.",
              "Enhance Awareness through Expert Insights.",
              "Foster a Supportive Learning Community.",
            ].map((text, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  my: { xs: 1.5, sm: 2 },
                }}
              >
                <DoneIcon sx={{ color: "#ee6d4f", fontSize: { xs: 20, sm: 24 } }} />
                <Typography
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
    
          {/* Image Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              component="img"
              src="https://res.cloudinary.com/dlnxfhrfs/image/upload/v1738515761/cg%20images/oiubvszzfdebddgkk8we.png"
              alt="Career Guidance Platform"
              sx={{
                width: { xs: "100%", sm: "80%", md: 460 },
                maxWidth: "100%",
                borderRadius: "25px",
                objectFit: "cover",
              }}
            />
            <List
              sx={{
                display: "flex",
                justifyContent: "center",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
            >
              {[1, 2, 3].map((_, index) => (
                <ListItem
                  key={index}
                  sx={{
                    width: { xs: 8, sm: 10 },
                    height: { xs: 8, sm: 10 },
                    borderRadius: "50%",
                    backgroundColor: index === 0 ? "#ee6d4f" : "grey.500",
                    mx: 0.5,
                    p: 0,
                    "&:hover": {
                      backgroundColor: "#ee6d4f",
                    },
                  }}
                />
              ))}
            </List>
          </Box>
        </Box>
      );
}
