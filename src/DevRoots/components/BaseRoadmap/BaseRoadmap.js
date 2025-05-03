/*
- File Name: BaseRoadmap.js
- Author: rania rabie
- Date of Creation: 16/4/2025
- Versions Information: 1.0.0
- Dependencies:
  {
    REACT,
    MUI,
    react-flow-renderer,
    Roadmap.css,
    prop-types, 
    IntroductionSection
  }
- Contributors: rania rabie
- Last Modified Date: 4/16/2025
- Description: A reusable base component for displaying roadmap data with React and MUI
*/
import React from "react";
import ReactFlow, { ReactFlowProvider } from "react-flow-renderer";
import Drawer from "@mui/material/Drawer";
import LinearProgress from "@mui/material/LinearProgress";
import Checkbox from "@mui/material/Checkbox";
import "react-flow-renderer/dist/style.css";
import { Box, Divider, Typography, IconButton, useTheme } from "@mui/material";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ArticleIcon from "@mui/icons-material/Article";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import "./Roadmap.css";
import IntroductionSection from "../IntroductionSection";

const BaseRoadmap = ({
  roadmapData,
  completedNodes = [],
  onNodeClick,
  onCheckboxChange,
  drawerOpen = false,
  selectedNodeData = null,
  onDrawerClose,
  customStyles = {},
}) => {
  const theme = useTheme();

  // Calculate progress
  const progress = roadmapData?.nodes?.length
    ? (completedNodes.length / roadmapData.nodes.length) * 100
    : 0;

  // Handle node click
  const handleNodeClick = (event, node) => {
    onNodeClick?.(node.data);
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (event, nodeId) => {
    event.stopPropagation();
    event.preventDefault();
    onCheckboxChange?.(nodeId);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    onDrawerClose?.();
  };

  return roadmapData ? (
    <Box >
      <IntroductionSection
        title={roadmapData.roadmapName}
        content={roadmapData.roadmapDescription}
      />
      <br />

      {/* Progress Bar */}
      <Box
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
            backgroundColor: "#b9bdc3",
            "& .MuiLinearProgress-bar": {
              backgroundColor: progress === 100 ? "#ee6c4d" : "#ee6c4d",
            },
            ...customStyles.progressBar,
          }}
        />
        <Typography sx={{color: theme.palette.text.primary}}>{Math.round(progress)}% Completed</Typography>
      </Box>

      <Box sx={{ height: "95vh", ...customStyles.flowContainer }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={roadmapData.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                label: (
                  <div style={{ position: "relative" }}>
                    {node.data.label}
                    <Checkbox
                      size="small"
                      sx={{
                        position: "absolute",
                        top: "-18px",
                        right: "-18px",
                        backgroundColor: "white",
                        zIndex: 1000,
                        color: "#EE6C4D",
                        "&.Mui-checked": {
                          color: "#EE6C4D",
                        },
                        "&.MuiCheckbox-root": {
                          width: "16px",
                          height: "16px",
                          borderRadius: "2px",
                          outline: "none",
                        },
                      }}
                      checked={completedNodes.includes(node.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => {
                        event.stopPropagation();
                        handleCheckboxChange(event, node.id);
                      }}
                    />
                  </div>
                ),
              },
            }))}
            edges={roadmapData.edges}
            fitView
            style={{ width: "100%", height: "80vh" }}
            onNodeClick={handleNodeClick}
          />
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
          <IconButton aria-label="close" onClick={handleDrawerClose}>
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
                          style={{
                            color: theme.palette.text.primary,
                            lineHeight: "1.3",
                          }}
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
                          style={{
                            color: theme.palette.text.primary,
                            lineHeight: "1.3",
                          }}
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
    </Box>
  ) : (
    <p>Loading roadmap details...</p>
  );
};

BaseRoadmap.propTypes = {
  roadmapData: PropTypes.shape({
    roadmapName: PropTypes.string,
    roadmapDescription: PropTypes.string,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        data: PropTypes.object,
      })
    ),
    edges: PropTypes.arrayOf(PropTypes.object),
  }),
  completedNodes: PropTypes.arrayOf(PropTypes.string),
  onNodeClick: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  drawerOpen: PropTypes.bool,
  selectedNodeData: PropTypes.object,
  onDrawerClose: PropTypes.func,
  customStyles: PropTypes.shape({
    container: PropTypes.object,
    headerBox: PropTypes.object,
    progressBar: PropTypes.object,
    flowContainer: PropTypes.object,
  }),
};

export default BaseRoadmap;
