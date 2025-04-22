// /*
// - File Name: SpecificRoadmap.js
// - Author: rania rabie
// - Date of Creation: 16/4/2025
// - Versions Information: 1.0.0
// - Dependencies:
//   {
//   REACT,
//   axios,
//   BaseRoadmap
//   }
// - Contributors: rania rabie, nourhan khaled
// - Last Modified Date: 16/4/2025
// - Description: A component that displays a specific roadmap using the BaseRoadmap component
// */

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import BaseRoadmap from "DevRoots/components/BaseRoadmap/BaseRoadmap";


// export default function StarthereRoadmap() {

//     const [roadmap, setRoadmap] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedNodeData, setSelectedNodeData] = useState(null);
//   const [completedNodes, setCompletedNodes] = useState([]);

//   useEffect(() => {
//     // Fetch the specific roadmap by ID
//     axios
//       .get(`https://careerguidance.runasp.net/api/Dashboard/GetById/9046784f-3377-4ce7-b1dd-e1d911e47dc0`)
//       .then((response) => {
//         const roadmap = response.data;
//         if (typeof roadmap.roadmapData === "string") {
//           roadmap.roadmapData = JSON.parse(roadmap.roadmapData);
//         }
//         setRoadmap(roadmap);
//       })
//       .catch((error) => {
//         console.error("Error fetching specific roadmap:", error);
//       });
//   });

//   // Handle node click to open the drawer
//   const handleNodeClick = (nodeData) => {
//     setSelectedNodeData(nodeData);
//     setDrawerOpen(true);
//   };

//   // Handle checkbox toggle
//   const handleCheckboxChange = (nodeId) => {
//     setCompletedNodes((prevCompleted) =>
//       prevCompleted.includes(nodeId)
//         ? prevCompleted.filter((id) => id !== nodeId)
//         : [...prevCompleted, nodeId]
//     );
//   };

//   // Handle drawer close
//   const handleDrawerClose = () => {
//     setDrawerOpen(false);
//   };
  
//   return (
//     <BaseRoadmap
//       roadmapData={roadmap?.roadmapData}
//       completedNodes={completedNodes}
//       onNodeClick={handleNodeClick}
//       onCheckboxChange={handleCheckboxChange}
//       drawerOpen={drawerOpen}
//       selectedNodeData={selectedNodeData}
//       onDrawerClose={handleDrawerClose}
//     />
//   );
// }






















import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseRoadmap from "DevRoots/components/BaseRoadmap/BaseRoadmap";
import { useAuth } from "context/AuthContext";

export default function StarthereRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [progressId, setProgressId] = useState(null);
  const roadmapId = "9046784f-3377-4ce7-b1dd-e1d911e47dc0";

const token = useAuth()
  // Fetch roadmap + user progress
  useEffect(() => {
    const fetchRoadmapAndProgress = async () => {
      if (!token) return;
  
      try {
        // 1. Get roadmap data
        const roadmapRes = await axios.get(
          `https://careerguidance.runasp.net/api/Dashboard/GetById/${roadmapId}`
        );
  
        const roadmapData = roadmapRes.data;
        if (typeof roadmapData.roadmapData === "string") {
          roadmapData.roadmapData = JSON.parse(roadmapData.roadmapData);
        }
  
        setRoadmap(roadmapData);
  
        // 2. Get user progress for this roadmap
        const progressRes = await axios.get(
          `http://localhost:3100/progressBar/${roadmapId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setCompletedNodes(progressRes.data.completedNodes || []);
        setProgressId(progressRes.data.id);
      } catch (error) {
        console.error("Error loading roadmap or progress:", error);
      }
    };
  
    fetchRoadmapAndProgress();
  }, []);
  

  const saveProgress = (updatedNodes) => {
    const progressValue = roadmap?.roadmapData?.nodes?.length
      ? (updatedNodes.length / roadmap.roadmapData.nodes.length) * 100
      : 0;

    const payload = {
      roadmapId,
      progressValue,
      completedNodes: updatedNodes,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (progressId) {
      // Use PUT if progress already exists
      axios
        .put(`http://localhost:3100/progressBar/${progressId}`, payload, config)
        .then((res) => {
          console.log("Progress updated:", res.data);
        })
        .catch((err) => {
          console.error("Update error:", err);
        });
    } else {
      // Use POST if progress is new
      axios
        .post(`http://localhost:3100/progressBar`, payload, config)
        .then((res) => {
          setProgressId(res.data.id);
          console.log("Progress saved:", res.data);
        })
        .catch((err) => {
          console.error("Save error:", err);
        });
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (nodeId) => {
    const updated = completedNodes.includes(nodeId)
      ? completedNodes.filter((id) => id !== nodeId)
      : [...completedNodes, nodeId];

    setCompletedNodes(updated);
    saveProgress(updated);
  };

  const handleNodeClick = (nodeData) => {
    setSelectedNodeData(nodeData);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <BaseRoadmap
      roadmapData={roadmap?.roadmapData}
      completedNodes={completedNodes}
      onNodeClick={handleNodeClick}
      onCheckboxChange={handleCheckboxChange}
      drawerOpen={drawerOpen}
      selectedNodeData={selectedNodeData}
      onDrawerClose={handleDrawerClose}
    />
  );
}
