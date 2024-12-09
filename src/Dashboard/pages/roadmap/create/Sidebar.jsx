/*
- File Name: Sidebar.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  DndContext file
  }
- Contributors:  rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : sidebar of roadmap that drag and drop nodes
*/
import React from "react";
import { useDnD } from "./DnDContext";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import Typography from "@mui/material/Typography";
import { Box, useTheme } from "@mui/material";

export default function Sidebar() {
  const [_, setType] = useDnD();
  const theme = useTheme(); // Access the current theme

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Prevent text dragging
  const preventDrag = (event) => {
    event.preventDefault();
  };

  // Styling based on theme mode
  const styles = {
    aside: {
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: theme.palette.background.paper, // Dynamic background color
      color: theme.palette.text.primary, // Dynamic text color
      boxShadow: theme.shadows[3],
    },
    node: {
      padding: "8px",
      margin: "8px 0",
      borderRadius: "4px",
      cursor: "grab",
      backgroundColor:
        theme.palette.mode === "dark" ? "#2e2e2e" : "#f0f0f0", // Different background for nodes
      color: theme.palette.text.primary,
    },
    tips: {
      marginTop: "16px",
      padding: "8px",
      borderRadius: "4px",
      backgroundColor:
        theme.palette.mode === "dark" ? "#333" : "#fafafa", // Tip box background
      color: theme.palette.text.primary,
    },
    tipsIcon: {
      color: theme.palette.mode === "dark" ? "#ffd517" : "#ffa500", // Icon color
    },
  };

  return (
    <aside style={styles.aside}>
      <div className="description" onDragStart={preventDrag}>
        You can drag these nodes to the pane on the right.
      </div>

      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
        style={styles.node}
      >
        Input Node
      </div>

      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
        style={styles.node}
      >
        Default Node
      </div>

      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
        style={styles.node}
      >
        Output Node
      </div>

      <Box style={styles.tips}>
        <Typography>
          <TipsAndUpdatesIcon fontSize="small" sx={styles.tipsIcon} /> Quick
          Tips:
        </Typography>
        <div>- To delete an edge or a node, select it and click "backspace".</div>
        <div>
          - To change node properties, click on it and toggle between properties
          and links.
        </div>
      </Box>
    </aside>
  );
}