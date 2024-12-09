/*
- File Name: RoadmapList.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  axios,
  react-router-dom ,
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : a list of all roadmaps component created by REACT and MUI
*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link to navigate between pages
import axios from "axios";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
// import Carousel from "./Carousel/Carousel";

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    // Fetch all roadmaps from the JSON server
    axios
      .get(
        "https://careerguidance.runasp.net/api/Dashboard/GetALlRoadmapsInDatabase"
      )
      .then((response) => {
        // Assuming response.data is an array of roadmaps
        const parsedRoadmaps = response.data.map((roadmap) => {
          // Parse StringDataToPublish from JSON string
          if (typeof roadmap.roadmapData === "string") {
            roadmap.roadmapData = JSON.parse(roadmap.roadmapData);
          }
          return roadmap;
        });

        setRoadmaps(parsedRoadmaps); // Set the fetched and parsed roadmaps
        console.log(parsedRoadmaps);
      })
      .catch((error) => {
        console.error("Error fetching roadmaps:", error);
      });
      
      // Fetch categories from the server
    axios
    .get("http://localhost:3001/categories")
    .then((response) => {
      setCategories(response.data); // Set fetched categories
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
  }, []);

  const theme = useTheme();
  return (
    <div>
      <Box sx={{ width: "80%", m: "auto", mt: 3 }}>
        {/* <Carousel/> */}
        <Box sx={{ width: {xs:"100%", lg:"80%"}, mx: "auto", py: 4 }}>
          <h2 style={{ textAlign: "center" }}>HI!</h2>
          <Typography
            variant="body1"
            sx={{
              textAlignLast: "left",
              fontSize: "18px",
              mt: 1,
              textTransform: "lowercase",
              color: theme.palette.text.primary,
            }}
          >
            Our website offers comprehensive educational resources covering all
            major tracks in computer science, including software development,
            networking, artificial intelligence, and cybersecurity. Explore
            tailored courses and materials to enhance your skills and advance
            your career in the tech industry.
          </Typography>
        </Box>

        <Divider textAlign="center" sx={{ mb: 2 }}>
          <h2
            style={{
              border: "1px solid #EE6C4D",
              borderRadius: "7px",
              padding: "2px",
              color: theme.palette.text.primary,
            }}
          >
            All Roadmaps
          </h2>
        </Divider>

        {categories
          .filter(
            (category) => category.fieldName.toLowerCase() !== "start here"
          )
          .map((category) => {
            const filteredRoadmaps = roadmaps.filter(
              (roadmap) =>
                roadmap.roadmapData.roadmapCategory === category.fieldName
            );

            return (
              <div key={category.id}>
                <Divider textAlign="left" sx={{ mb: 2 }}>
                  <h3
                    style={{
                      border: "1px solid #EE6C4D",
                      borderRadius: "7px",
                      padding: "2px",
                    }}
                  >
                    {category.fieldName}
                  </h3>
                </Divider>

                {filteredRoadmaps.length > 0 ? (
                  <Stack
                    direction={"row"}
                    sx={{
                      gap: 2,
                      flexWrap: "wrap",
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    {filteredRoadmaps.map((roadmap) => (
                      <Box
                        key={roadmap.id}
                        className="all-roadmaps"
                        sx={{
                          my: 2,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "#262626"
                              : "#f4f6f8",
                        }}
                      >
                        <Link to={`/roadmap/${roadmap.id}`} className="roadmap">
                          <img
                            src={roadmap.roadmapData.imageUrl}
                            alt={`${category.fieldName.toLowerCase()} img`}
                            className="roadmapImg"
                            width={"100%"}
                          />
                          <Typography
                            component={"div"}
                            sx={{ py: 1, color: theme.palette.text.primary }}
                          >
                            {roadmap.roadmapData.roadmapName}
                          </Typography>
                        </Link>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    Roadmaps will be added soon...
                  </Typography>
                )}
              </div>
            );
          })}
      </Box>
    </div>
  );
};

export default RoadmapList;
