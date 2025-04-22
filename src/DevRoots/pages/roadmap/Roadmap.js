/*
- File Name: Roadmap.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.2.0
- Dependencies:
  {
  REACT,
  axios,
  react-router-dom,
  BaseRoadmap
  }
- Contributors: rania rabie, nourhan khaled
- Last Modified Date: 16/4/2025
- Description: A component that fetches and displays a roadmap by ID using the BaseRoadmap component
*/
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BaseRoadmap from "DevRoots/components/BaseRoadmap/BaseRoadmap";
import { Box } from "@mui/material";

const Roadmap = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);

  useEffect(() => {
    // Fetch the roadmap by ID
    axios
      .get(`https://careerguidance.runasp.net/api/Dashboard/GetById/${id}`)
      .then((response) => {
        const roadmap = response.data;
        if (typeof roadmap.roadmapData === "string") {
          roadmap.roadmapData = JSON.parse(roadmap.roadmapData);
        }
        setRoadmap(roadmap);
      })
      .catch((error) => {
        console.error("Error fetching roadmap:", error);
      });
  }, [id]);

  // Handle node click to open the drawer
  const handleNodeClick = (nodeData) => {
    setSelectedNodeData(nodeData);
    setDrawerOpen(true);
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (nodeId) => {
    setCompletedNodes((prevCompleted) =>
      prevCompleted.includes(nodeId)
        ? prevCompleted.filter((id) => id !== nodeId)
        : [...prevCompleted, nodeId]
    );
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{marginTop: "calc(64px + 2rem)" , width: "80%", m: "auto",}}>
    <BaseRoadmap
      roadmapData={roadmap?.roadmapData}
      completedNodes={completedNodes}
      onNodeClick={handleNodeClick}
      onCheckboxChange={handleCheckboxChange}
      drawerOpen={drawerOpen}
      selectedNodeData={selectedNodeData}
      onDrawerClose={handleDrawerClose}
    />
    </Box>
  );
};

export default Roadmap;