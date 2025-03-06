// // @ts-ignore
// import { Handle, Position } from '@xyflow/react';
// import React from 'react';


// const FourHandlesNode = ({ data }) => {
//   return (
//     <div>
//     <div>{data.label || "Custom Node"}</div>

//       {/* Top handle */}
//       <Handle type="target" position={Position.Top} id="top-target" isConnectable/>

//       {/* Right handle */}
//       <Handle type="source" position={Position.Right} id="right-source" isConnectable/>

//       {/* Bottom handle */}
//       <Handle type="source" position={Position.Bottom} id="bottom-source" isConnectable/>

//       {/* Left handle */}
//       <Handle type="target" position={Position.Left} id="left-target" isConnectable/>
//     </div>
//   );
// };

// export default FourHandlesNode;



// @ts-ignore
import { Handle, Position, useEdges } from '@xyflow/react';
import React, { useEffect, useState } from 'react';

const FourHandlesNode = ({ id, data }) => {
  const edges = useEdges();
  const [connectedHandles, setConnectedHandles] = useState({});

  useEffect(() => {
    // Create an object to track connected handles
    const connectionStatus = {
      "top-target": false,
      "right-source": false,
      "bottom-source": false,
      "left-target": false,
    };

    // Update the connection status based on current edges
    edges.forEach((edge) => {
      if (edge.source === id) connectionStatus[edge.sourceHandle] = true;
      if (edge.target === id) connectionStatus[edge.targetHandle] = true;
    });

    // Set the updated status
    setConnectedHandles(connectionStatus);
  }, [edges, id]);

  return (
    <div>
      <div>{data.label || "Custom Node"}</div>

      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        isConnectable
        style={{ opacity: connectedHandles["top-target"] ? 1 : 0 }}
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable
        style={{ opacity: connectedHandles["right-source"] ? 1 : 0 }}
      />

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        isConnectable
        style={{ opacity: connectedHandles["bottom-source"] ? 1 : 0 }}
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable
        style={{ opacity: connectedHandles["left-target"] ? 1 : 0 }}
      />
    </div>
  );
};

export default FourHandlesNode;
