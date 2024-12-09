/*
- File Name: RoadmapContext.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  }
- Contributors: rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : Roadmap context
*/
import React, { createContext, useState } from "react";

// @ts-ignore
export const RoadmapContext = createContext();

export const RoadmapProvider = ({ children }) => {
  const [roadmapCategory, setRoadmapCategory] = useState(""); 
  const [roadmapName, setRoadmapName] = useState("");
  const [roadmapDescription, setRoadmapDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <RoadmapContext.Provider
      value={{
        roadmapCategory, // Added category to context
        setRoadmapCategory, // Added category setter to context
        roadmapName,
        setRoadmapName,
        roadmapDescription,
        setRoadmapDescription,
        imageUrl,
        setImageUrl,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};
