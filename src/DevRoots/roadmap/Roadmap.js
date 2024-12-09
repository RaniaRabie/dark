/*
- File Name: Roadmap.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom ,
  react-flow-renderer,
  Roadmap.css
  }
- Contributors:  rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : a roadmap component created by REACT and MUI that display each roadmap data
*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, { ReactFlowProvider } from "react-flow-renderer";
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import Checkbox from "@mui/material/Checkbox";
import "react-flow-renderer/dist/style.css";
import { useParams } from "react-router-dom"; // Hook to get URL parameters
import "./Roadmap.css";
import { Box, Divider, Typography, IconButton, useTheme } from "@mui/material";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ArticleIcon from "@mui/icons-material/Article";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CloseIcon from "@mui/icons-material/Close";

const Roadmap = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // State to handle drawer open/close
  const [selectedNodeData, setSelectedNodeData] = useState(null); // State to store selected node data
  const [completedNodes, setCompletedNodes] = useState([]); // State to track completed nodes (checkbox)

  useEffect(() => {
    // Fetch the roadmap by ID
    axios
      .get(`https://careerguidance.runasp.net/api/Dashboard/GetById/${id}`)
      .then((response) => {
        const roadmap = response.data; // Single roadmap object

        // Parse StringDataToPuplish if it's a string
        if (typeof roadmap.roadmapData === "string") {
          roadmap.roadmapData = JSON.parse(roadmap.roadmapData);
        }

        setRoadmap(roadmap); // Set the fetched and parsed roadmap
      })
      .catch((error) => {
        console.error("Error fetching roadmap:", error);
      });
  }, [id]);

  // Handle node click to open the drawer and display node data
  const handleNodeClick = (event, node) => {
    setSelectedNodeData(node.data); // Set the selected node data
    setDrawerOpen(true); // Open the drawer
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (event, nodeId) => {
    event.stopPropagation(); // Prevent the drawer from opening
    event.preventDefault();
    setCompletedNodes(
      (prevCompleted) =>
        prevCompleted.includes(nodeId)
          ? prevCompleted.filter((id) => id !== nodeId) // Remove node if unchecked
          : [...prevCompleted, nodeId] // Add node if checked
    );
  };

  // Calculate progress as percentage of completed nodes
  const progress = roadmap?.roadmapData?.nodes?.length
    ? (completedNodes.length / roadmap.roadmapData.nodes.length) * 100
    : 0;
  const theme = useTheme();
  return roadmap ? (
    <div style={{ width: "80%", margin: "auto" }}>
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          minHeight: "auto",
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
          {roadmap.roadmapData.roadmapName}
        </h2>
        <p style={{ textAlignLast: "left" }}>
          {roadmap.roadmapData.roadmapDescription}
        </p>
      </Box>
      <br />

      {/* Progress Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            width: "300px",
            height: "20px",
            borderRadius: 1,
            backgroundColor: "#b9bdc3", // Background of the track
            "& .MuiLinearProgress-bar": {
              backgroundColor: progress === 100 ? "#ee6c4d" : "#ee6c4d", // Changes color when complete
            },
          }}
        />
        <p>{Math.round(progress)}% Completed</p>
      </div>

      <Box sx={{ height: "95vh" }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={roadmap.roadmapData.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                label: (
                  <div style={{ position: "relative" }}>
                    {/* Render the node label */}
                    {node.data.label}

                    {/* Add checkbox in the top right corner of each node */}
                    <Checkbox
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "-18px",
                        right: "-18px",
                        backgroundColor: "white", // Background for visibility
                        zIndex: 1000,
                        color: "#EE6C4D",
                        "&.Mui-checked": {
                          color: "#EE6C4D", // Color when checked
                        },
                        "&.MuiCheckbox-root": {
                          width: "16px", // Custom width
                          height: "16px", // Custom height
                          borderRadius: "2px",
                          outline: "none",
                        },
                      }}
                      checked={completedNodes.includes(node.id)} // Check if the node is completed
                      onClick={(event) => event.stopPropagation()} // Prevent the drawer from opening
                      onChange={(event) => {
                        event.stopPropagation(); // Prevent the drawer from opening
                        handleCheckboxChange(event, node.id);
                      }}
                    />
                  </div>
                ),
              },
            }))}
            edges={roadmap.roadmapData.edges}
            fitView
            style={{ width: "100%", height: "80vh" }}
            onNodeClick={handleNodeClick} // Attach node click handler
            // zoomOnScroll={false} // Disable zoom on scroll
            // zoomOnDoubleClick={false} // Disable zoom on double click
            // zoomOnPinch={false} // Disable zoom on pinch
            // panOnScroll={false} // Allow normal scrolling
            // panOnDrag={false}
          ></ReactFlow>
        </ReactFlowProvider>
      </Box>

      {/* Drawer to display node data */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ width: 400, "& .MuiDrawer-paper": { width: 400 } }}
      >
        <div style={{ width: "400px", padding: "22px" }}>
          <IconButton aria-label="" onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>

          {selectedNodeData ? (
            <div>
              <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
                {selectedNodeData.title}
              </h3>
              <p style={{ margin: "16px 0px" }}>
                {selectedNodeData.description}
              </p>

              {/* Videos Section */}
              <Divider textAlign="left" sx={{ my: 1.5 }}>
                <Box
                  sx={{
                    border: "1px solid #293241",
                    borderRadius: "7px",
                    padding: "2px",
                    display: "flex",
                  }}
                >
                  <OndemandVideoIcon
                    fontSize="small"
                    sx={{ color: "#EE6C4D" }}
                  />
                  <Typography
                    variant="body2"
                    color="initial"
                    sx={{ ml: 0.5, color: theme.palette.text.primary }}
                  >
                    Videos
                  </Typography>
                </Box>
              </Divider>

              <Box>
                {selectedNodeData.links &&
                selectedNodeData.links.filter((link) => link.type === "Video")
                  .length > 0 ? (
                  selectedNodeData.links
                    .filter((link) => link.type === "Video")
                    .map((link, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <span
                          style={{
                            backgroundColor:
                              link.EnOrAr === "Ar" ? "#98C1D9" : "#EE6C4D",
                            display: "inline-block",
                            width: "22px",
                            height: "22px",
                            textAlign: "center",
                            lineHeight: "22px",
                            borderRadius: "7px",
                            color: "white",
                            marginRight: "8px",
                          }}
                        >
                          {link.EnOrAr}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.text.primary, lineHeight: "1.3" }}
                        >
                          {link.title}
                          <span>
                            {link.premOrFree === "Premium" ? (
                              <WorkspacePremiumIcon
                                sx={{ color: "#EE6C4D", fontSize: "20px" }}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                        </a>
                      </Box>
                    ))
                ) : (
                  <Typography>No video links available</Typography>
                )}
              </Box>

              {/* Articles Section */}
              <Divider textAlign="left" sx={{ my: 1.5 }}>
                <Box
                  sx={{
                    border: "1px solid #293241",
                    borderRadius: "7px",
                    padding: "2px",
                    display: "flex",
                    
                  }}
                >
                  <ArticleIcon fontSize="small" sx={{ color: "#EE6C4D" }} />
                  <Typography
                    variant="body2"
                    color="initial"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    Articles
                  </Typography>
                </Box>
              </Divider>

              <Box>
                {selectedNodeData.links &&
                selectedNodeData.links.filter((link) => link.type === "Article")
                  .length > 0 ? (
                  selectedNodeData.links
                    .filter((link) => link.type === "Article")
                    .map((link, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <span
                          style={{
                            backgroundColor:
                            link.EnOrAr === "Ar" ? "#98C1D9" : "#EE6C4D",
                            display: "inline-block",
                            width: "22px",
                            height: "22px",
                            textAlign: "center",
                            lineHeight: "22px",
                            borderRadius: "7px",
                            color: "white",
                            marginRight: "8px",
                          }}
                        >
                          {link.EnOrAr}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: theme.palette.text.primary, lineHeight: "1.3" }}
                        >
                          {link.title}
                          <span>
                            {link.premOrFree === "Premium" ? (
                              <WorkspacePremiumIcon
                                sx={{ color: "#EE6C4D", fontSize: "20px" }}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                        </a>
                      </Box>
                    ))
                ) : (
                  <Typography>No Article available</Typography>
                )}
              </Box>
            </div>
          ) : (
            <p>No node selected</p>
          )}
        </div>
      </Drawer>
    </div>
  ) : (
    <p>Loading roadmap details...</p>
  );
};

export default Roadmap;
