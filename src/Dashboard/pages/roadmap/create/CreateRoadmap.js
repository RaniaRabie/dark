/*
- File Name: CreateRoadmap.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom ,
  @xyflow,
  RoadmapContext,
  Sidebar file,
  DnDContext file ,
  CreateRoadmap.css,
  }
- Contributors: rania rabie,nourhan khaled
- Last Modified Date: 10/12/2024
- Description :  create roadmap
*/
import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  BackgroundVariant,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";
import { RoadmapContext } from "./RoadmapContext";

import Sidebar from "./Sidebar";
import { DnDProvider, useDnD } from "./DnDContext";
import "./CreateRoadmap.css";

let id = 0;
const getId = () => `dndnode_${id++}`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const DnDFlow = () => {
  const location = useLocation();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  // Edit hooks for node properties
  const [editValue, setEditValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("14px");
  const [fontWeight, setFontWeight] = useState("normal");
  const [width, setWidth] = useState("150px"); // Default width
  const [height, setHeight] = useState("38px"); // Default height
  const [borderRadius, setBorderRadius] = useState("5px"); // New state for border radius
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Unified position state
  const [tabIndex, setTabIndex] = useState(0); // Add for Tabs
  const [nodeTitle, setnodeTitle] = useState("");
  const [nodeDescription, setnodeDescription] = useState("");

  const [links, setLinks] = useState([]); // State for links
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const { id } = useParams();

  // Handle node selection
  const onNodeClick = (e, node) => {
    setEditValue(node.data.label);
    setSelectedId(node.id);
    setBgColor(node.style?.backgroundColor || "#ffffff");
    setTextColor(node.style?.color || "#000000");
    setFontSize(node.style?.fontSize || "14px");
    setFontWeight(node.style?.fontWeight || "normal");
    setWidth(node.style?.width.replace("px", "") || "150px");
    setHeight(node.style?.height.replace("px", "") || "38px");
    setBorderRadius(node.style?.borderRadius.replace("px", "") || "5px"); // Set border radius
    setPosition(node.position); // Update unified position state
    setOpen(true);
    setnodeTitle(node.data?.title || "");
    setnodeDescription(node.data?.description || "");
    setLinks(node.data?.links || []); // Load node-specific links
  };

  // Handle link changes for a specific node
  const handleLinkChange = (index, key, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], [key]: value };
    setLinks(updatedLinks);
    updateNodeLinks(updatedLinks);
  };

  const handleAddLink = () => {
    setLinks([
      ...links,
      { type: "", EnOrAr: "", premOrFree: "", title: "", url: "" },
    ]);
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
    updateNodeLinks(updatedLinks);
  };

  // Update node links
  const updateNodeLinks = (newLinks) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedId
          ? {
              ...node,
              data: {
                ...node.data,
                links: newLinks,
              },
            }
          : node
      )
    );
  };

  // Handle real-time node position updates
  const handleNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
    // onNodesChange(changes);
    const movedNode = changes.find(
      (change) => change.type === "position" && change.id === selectedId
    );
    if (movedNode) {
      setPosition(movedNode.position); // Update unified position state
    }
  };

  const handleEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  // Update node styles
  const updateNodeStyles = (overrides = {}) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: overrides.label ?? editValue,
            title: overrides.title ?? nodeTitle,
            description: overrides.description ?? nodeDescription,
            links: overrides.links ?? links,
          },
          style: {
            ...node.style,
            backgroundColor: overrides.bgColor ?? bgColor,
            color: overrides.textColor ?? textColor,
            fontSize: overrides.fontSize ?? fontSize,
            fontWeight: overrides.fontWeight ?? fontWeight,
            width: `${overrides.width ?? width}px`,
            height: `${overrides.height ?? height}px`,
            borderRadius: `${overrides.borderRadius ?? borderRadius}px`,
          },
          position: {
            x: overrides.position?.x ?? position.x,
            y: overrides.position?.y ?? position.y,
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  const handleLabelChange = (e) => {
    const newLabel = e.target.value;
    setEditValue(newLabel); // Update state as usual
    updateNodeStyles({ label: newLabel }); // Immediately pass the new label value to update the node
  };

  // Functions to handle changes for all fields
  const handleBgColorChange = (e) => {
    const newBgColor = e.target.value;
    setBgColor(newBgColor);
    updateNodeStyles({ bgColor: newBgColor });
  };

  const handleTextColorChange = (e) => {
    const newTextColor = e.target.value;
    setTextColor(newTextColor);
    updateNodeStyles({ textColor: newTextColor });
  };

  const handleFontSizeChange = (e) => {
    const newFontSize = `${e.target.value}px`;
    setFontSize(newFontSize);
    updateNodeStyles({ fontSize: newFontSize });
  };

  const handleFontWeightChange = (e) => {
    const newFontWeight = e.target.value;
    setFontWeight(newFontWeight);
    updateNodeStyles({ fontWeight: newFontWeight });
  };

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    updateNodeStyles({ width: newWidth });
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    updateNodeStyles({ height: newHeight });
  };

  const handleBorderRadiusChange = (e) => {
    const newBorderRadius = e.target.value;
    setBorderRadius(newBorderRadius);
    updateNodeStyles({ borderRadius: newBorderRadius });
  };

  // Handler for updating position
  const handlePositionChange = (axis, value) => {
    setPosition((prev) => {
      const updatedPosition = { ...prev, [axis]: value };
      updateNodeStyles({ position: updatedPosition }); // Ensure updateNodeStyles uses the updated position
      return updatedPosition;
    });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setnodeTitle(newTitle);
    updateNodeStyles({ title: newTitle });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setnodeDescription(newDescription);
    updateNodeStyles({ description: newDescription });
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // Check if type is defined
      if (!type) {
        return;
      }

      // Get the position where the new node will be placed
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Find the maximum existing ID to ensure uniqueness
      const existingIds = nodes.map((node) => parseInt(node.id, 10)); // Convert IDs to numbers
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : -1; // Get the maximum ID or -1 if no nodes exist

      // Create a new unique ID
      const newId = (maxId + 1).toString(); // Increment the maxId for the new ID

      // Create the new node object
      const newNode = {
        id: newId, // Use the new unique ID
        type, // Type of the new node
        position, // Position of the new node
        data: { label: `${type} node` }, // Data for the new node
        style: {
          backgroundColor: "#ffffff", // Background color
          color: "#000000", // Text color
          fontSize: "14px", // Font size
          fontWeight: "normal", // Font weight
          width: "150px", // Width of the node
          height: "38px", // Height of the node
          borderRadius: "5px", // Border radius
        },
      };

      // Update the nodes by concatenating the new node with existing ones
      setNodes((prevNodes) => [...prevNodes, newNode]); // Use spread operator to concatenate
    },
    [screenToFlowPosition, type, nodes, setNodes] // Include nodes in dependencies
  );

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex); // Handle tab switching
  };

  const {
    roadmapCategory,
    setRoadmapCategory,
    roadmapName,
    setRoadmapName,
    roadmapDescription,
    setRoadmapDescription,
    imageUrl,
    setImageUrl,
  } = useContext(RoadmapContext);

  const roadmapData = {
    roadmapCategory,
    roadmapName,
    roadmapDescription,
    imageUrl,
    nodes: nodes, // Include the nodes
    edges: edges, // Include the edges
  };

  // Function to publish nodes to the JSON server as string

  // const publishNodes = () => {
  //     const roadmapData = {
  //       roadmapCategory,
  //       roadmapName,
  //       roadmapDescription,
  //       imageUrl,
  //       nodes: nodes, // Include the nodes
  //       edges: edges, // Include the edges
  //     };

  //     // Convert dataToPublish to a JSON string
  //     const dataString = JSON.stringify(roadmapData);

  //     axios
  //       .post("https://careerguidance.runasp.net/api/Dashboard/AddDataForRoadmap", { roadmapData: dataString }) // Send as a string
  //       .then((response) => {
  //         console.log("Nodes data successfully stored:", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error saving nodes data:", error);
  //       });
  //       navigate("/allroadmaps")
  //   };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const publishNodes = async () => {
    const roadmapData = {
      roadmapCategory,
      roadmapName,
      roadmapDescription,
      imageUrl,
      nodes, // Include the nodes
      edges, // Include the edges
    };

    try {
      // Post data to the server
      const response = await axios.post(
        "https://careerguidance.runasp.net/api/Dashboard/AddRoadmapData",
        { roadmapData: JSON.stringify(roadmapData) }
      );

      console.log("Nodes data successfully stored:", response.data);

      // Navigate to the new page after data is successfully posted
      navigate("/dashboard/allroadmaps");
    } catch (error) {
      console.error("Error saving nodes data:", error);

      if (
        (error.response && error.response.status === 400) ||
        (error.response && error.response.status === 409) ||
        (error.response && error.response.status === 401)
      ) {
        const errorMessage = error.response.data.errors[1];
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setOpenSnackbar(true);
    }
  };

  const isCreatePath = location.pathname === "/dashboard/create";
  const isUpdatePath = location.pathname.startsWith("/dashboard/create/");

  //Fetch roadmap and nodes by ID
  useEffect(() => {
    if (isUpdatePath) {
      axios
        .get(`https://careerguidance.runasp.net/api/Dashboard/GetById/${id}`)
        .then((response) => {
          let parsedRoadmap = response.data.roadmapData;
          if (typeof parsedRoadmap === "string") {
            parsedRoadmap = JSON.parse(parsedRoadmap);
          }
          const {
            roadmapCategory,
            roadmapName,
            roadmapDescription,
            imageUrl,
            nodes,
            edges,
          } = parsedRoadmap;

          console.log("Fetched roadmapCategory:", roadmapCategory);
          console.log("Fetched roadmapName:", roadmapName);
          console.log("Fetched roadmap Description:", roadmapDescription);
          console.log("Fetched image Url:", imageUrl);
          console.log("Fetched nodes:", nodes); // Check fetched nodes
          console.log("Fetched edges:", edges); // Check fetched edges

          setRoadmapCategory(roadmapCategory || "");
          setRoadmapName(roadmapName || ""); // Set the roadmapName from the response
          setRoadmapDescription(roadmapDescription || ""); // Set the roadmapName from the response
          setImageUrl(imageUrl || ""); // Set the roadmapName from the response
          setNodes(nodes || []); // Set the nodes from the response
          setEdges(edges || []); // Set the edges from the response

          console.log(response.data);
          setRoadmap(response.data); // Set the specific roadmap data
        })
        .catch((error) => {
          console.error("Error fetching roadmap:", error);
          if (
            (error.response && error.response.status === 400) ||
            (error.response && error.response.status === 409) ||
            (error.response && error.response.status === 401)
          ) {
            const errorMessage = error.response.data.errors[1];
            setErrorMessage(errorMessage);
          } else {
            setErrorMessage("An unexpected error occurred.");
          }
          setOpenSnackbar(true);
        });
    }
  }, [
    id,
    isUpdatePath,
    setRoadmapCategory,
    setRoadmapName,
    setRoadmapDescription,
    setImageUrl,
    setNodes,
    setEdges,
  ]);

  // function to update a roadmap

  const updateNodes = () => {
    // Convert dataToPublish to a JSON string
    const stringifiedroadmapData = JSON.stringify(roadmapData);

    // Send the stringified data to the server
    axios
      .put(`https://careerguidance.runasp.net/api/Dashboard/Update/${id}`, {
        roadmapData: stringifiedroadmapData,
      })
      .then(() => {
        console.log("Roadmap updated successfully.");
        navigate("/dashboard/allroadmaps"); // Redirect after update
      })
      .catch((error) => {
        console.error("Error updating Roadmap:", error);
        if (
          (error.response && error.response.status === 400) ||
          (error.response && error.response.status === 409) ||
          (error.response && error.response.status === 401)
        ) {
          const errorMessage = error.response.data.errors[1];
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
        setOpenSnackbar(true);
      });
  };


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };
  const theme = useTheme()

  return (
    <div style={{ width: "100%", height: "90vh" }} className="dndflow">
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 300, ml: 2, mt: "45px" }}
          role="presentation"
          onClick={(event) => event.stopPropagation()} // Prevent closing when clicking inside the drawer
        >
          {/* Tabs for switching between Properties and Links */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="node drawer tabs"
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                display: "none", // Hide the underline indicator
              },
            }}
            sx={{
              mt: 1,
            }}
          >
            <Tab
              label="Properties"
              sx={{
                borderRadius: "15px",
                backgroundColor: tabIndex === 0 ? "#98C1D9" : "transparent", // Active tab background
                color: tabIndex === 0 ? "#293241" : theme.palette.text.primary, // Active tab text color
                "&.Mui-selected": {
                  backgroundColor: "#EE6C4D", // Active tab specific background color
                  color: "#FFFFFF",
                },
              }}
            />
            <Tab
              label="Links"
              sx={{
                mr: 2,
                height: "2px",
                borderRadius: "15px",
                backgroundColor: tabIndex === 1 ? "#98C1D9" : "transparent", // Active tab background
                color: tabIndex === 1 ? "#293241" : theme.palette.text.primary, // Active tab text color
                "&.Mui-selected": {
                  backgroundColor: "#EE6C4D", // Active tab specific background color
                  color: "#FFFFFF", // Active tab specific text color
                },
              }}
            />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <label>Node Name:</label>
            <br />
            <input
              className="nodeName"
              type="text"
              value={editValue}
              onChange={handleLabelChange}
              draggable={false}
            />
            <br />

            <label>Background Color: </label>
            <input
              type="color"
              value={bgColor}
              onChange={handleBgColorChange}
              disabled={!selectedId}
            />
            <br />

            <label>Text Color: </label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              disabled={!selectedId}
              style={{ margin: "10px 0px" }}
            />
            <br />

            <label>Font Size (px): </label>
            <input
              type="number"
              value={fontSize.replace("px", "")}
              onChange={handleFontSizeChange}
              disabled={!selectedId}
              style={{ width: "50px", padding: "5px 0px 5px 7px" }}
            />
            <br />

            <label>Font Weight: </label>
            <select
              value={fontWeight}
              onChange={handleFontWeightChange}
              disabled={!selectedId}
              style={{ margin: "10px 0px", padding: "5px" }}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
            <br />

            <label>Width:</label>
            <input
              type="number"
              value={width}
              onChange={handleWidthChange}
              disabled={!selectedId}
              style={{
                width: "100px",
                marginLeft: "10px",
                padding: "5px",
                marginTop: "10px",
              }}
            />
            <br />

            <label>Height:</label>
            <input
              type="number"
              value={height}
              onChange={handleHeightChange}
              disabled={!selectedId}
              style={{
                width: "100px",
                marginLeft: "10px",
                padding: "5px",
                marginTop: "10px",
              }}
            />
            <br />

            <label>Border Radius (px): </label>
            <input
              type="number"
              value={borderRadius}
              onChange={handleBorderRadiusChange}
              disabled={!selectedId}
              style={{
                width: "50px",
                marginLeft: "10px",
                padding: "5px",
                marginTop: "10px",
              }}
            />
            <br />
            <br />

            <label>Position X:</label>
            <input
              type="number"
              value={position.x} // Use unified position state
              onChange={(e) => {
                const newX = parseInt(e.target.value, 10);
                handlePositionChange("x", newX);
              }}
              disabled={!selectedId}
              style={{ width: "100px", marginLeft: "10px", padding: "5px" }}
            />
            <br />

            <label>Position Y:</label>
            <input
              type="number"
              value={position.y} // Use unified position state
              onChange={(e) => {
                const newY = parseInt(e.target.value, 10);
                handlePositionChange("y", newY);
              }}
              disabled={!selectedId}
              style={{
                width: "100px",
                marginLeft: "10px",
                padding: "5px",
                marginTop: "10px",
              }}
            />
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <label>Title:</label>
            <br />
            <input
              className="nodeData"
              type="text"
              value={nodeTitle}
              onChange={handleTitleChange}
            />
            <br />
            <label>Description:</label>
            <br />
            <textarea
              className="nodeData nodeDescription"
              rows={15}
              cols={25}
              value={nodeDescription}
              onChange={handleDescriptionChange}
            />

            {/* <Box sx={{ my: 3 }}>
          <label className="nodeDescription">Description</label>
          <br />
          <TextField
            id="outlined-multiline-flexible"
            multiline
            value={nodeDescription}
            onChange={handleDescriptionChange}
            sx={{ mt: 2 }}
          />
        </Box> */}

            <br />
            <Divider />
            {links.map((link, index) => (
              <div key={index} className="linksContainer">
                <select
                  value={link.type}
                  onChange={(e) =>
                    handleLinkChange(index, "type", e.target.value)
                  }
                  className="selectSourceType"
                >
                  <option value="" hidden>
                    Select Type
                  </option>
                  <option value="Article">Article</option>
                  <option value="Video">Video</option>
                </select>

                <Box sx={{ display: "flex", gap: "4%" }}>
                  <select
                    value={link.EnOrAr}
                    onChange={(e) =>
                      handleLinkChange(index, "EnOrAr", e.target.value)
                    }
                    style={{ width: "43%" }}
                    className="selectSourceType enOrAr"
                  >
                    <option value="" hidden>
                      En or Ar
                    </option>
                    <option value="En">En</option>
                    <option value="Ar">Ar</option>
                  </select>

                  <select
                    value={link.premOrFree}
                    onChange={(e) =>
                      handleLinkChange(index, "premOrFree", e.target.value)
                    }
                    style={{ width: "43%" }}
                    className="selectSourceType premOrFree"
                  >
                    <option value="" hidden>
                      Prem or Free
                    </option>
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </Box>

                <input
                  type="text"
                  placeholder="Link Title"
                  value={link.title}
                  onChange={(e) =>
                    handleLinkChange(index, "title", e.target.value)
                  }
                  className="linkTitle"
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                  className="linkUrl"
                />
                <Divider />
                <IconButton
                  onClick={() => handleDeleteLink(index)}
                  aria-label="delete link"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <button onClick={handleAddLink} className="addLink">
              Add Link
            </button>
          </TabPanel>
        </Box>
      </Drawer>

      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(e, val) => onNodeClick(e, val)}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>

        {isCreatePath && (
          <Button
            onClick={publishNodes}
            variant="contained"
            sx={{ my: 2, cursor: "pointer" }}
          >
            Publish Roadmap
          </Button>
        )}
        {isUpdatePath && (
          <Button
            onClick={updateNodes}
            variant="contained"
            sx={{ my: 2, cursor: "pointer" }}
          >
            Update Roadmap
          </Button>
        )}
      </div>
      <Sidebar />
      <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
