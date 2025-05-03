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
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import BaseRoadmap from "DevRoots/components/BaseRoadmap/BaseRoadmap";
import { Box } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import {api} from "../../../services/axiosInstance"

const Roadmap = () => {
const { id: roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [progressId, setProgressId] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;
  const saveTimeout = useRef(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const roadmapRes = await api.get(`/api/Dashboard/GetById/${roadmapId}`);
        const roadmapData = roadmapRes.data;
        if (typeof roadmapData.roadmapData === "string") {
          roadmapData.roadmapData = JSON.parse(roadmapData.roadmapData);
        }
        setRoadmap(roadmapData);
      } catch (error) {
        console.error("Error loading roadmap:", error);
      }
    };

    const fetchProgress = async () => {
      if (!userId) return;
      try {
        const progressRes = await api.get(`/api/progressBar/GetAll`);
        const existing = progressRes.data.find(
          (entry) => entry.userId === userId && entry.roadmapId === roadmapId
        );
        if (existing) {
          setCompletedNodes(existing.completedNodes || []);
          setProgressId(existing.id);
        } else {
          setCompletedNodes([]);
          setProgressId(null);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    };

    if (roadmapId) {
      fetchRoadmap();
      fetchProgress();
    }
  }, [roadmapId, userId]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  const saveProgress = (updatedNodes) => {
    if (!userId) return;

    const total = roadmap?.roadmapData?.nodes?.length || 0;
    const progressValue = total > 0
      ? Math.round((updatedNodes.length / total) * 100)
      : 0;

    const payload = {
      userId,
      roadmapId,
      roadmapName: roadmap?.roadmapData.roadmapName || "",
      progressValue,
      completedNodes: updatedNodes,
    };

    if (progressId) {
      api
        .put(`/api/progressBar/UpdateProgressBar${progressId}`, payload)
        .then((res) => {
          console.log("Progress updated:", res.data);
        })
        .catch((err) => {
          console.error("Progress update failed:", err);
        });
    } else {
      api
        .post(`/api/progressBar/AddProgress`, payload)
        .then((res) => {
          setProgressId(res.data.id);
          console.log("Progress created:", res.data);
          window.location.reload()
        })
        .catch((err) => {
          console.error("Progress create failed:", err);
        });
    }
  };

  const handleCheckboxChange = (nodeId) => {
    const updated = completedNodes.includes(nodeId)
      ? completedNodes.filter((id) => id !== nodeId)
      : [...completedNodes, nodeId];

    setCompletedNodes(updated);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveProgress(updated);
    }, 500);
  };
  
  const handleNodeClick = (nodeData) => {
    setSelectedNodeData(nodeData);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ marginTop: "calc(64px + 2rem)", width: "80%", m: "auto" }}>
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
