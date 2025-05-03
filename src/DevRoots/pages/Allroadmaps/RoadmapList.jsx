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
- Last Modified Date: 10/12/2024
- Description : a list of all roadmaps component created by REACT and MUI
*/
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link to navigate between pages
import axios from "axios";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import IntroductionSection from "DevRoots/components/IntroductionSection";
import {api} from "../../../services/axiosInstance"

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    // Fetch all roadmaps from the JSON server
    api
      .get(
        "/api/Dashboard/GetALlRoadmapsInDatabase"
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
      .get(
        "https://careerguidance.runasp.net/api/Dashboard/GetAllCategoryInDatabase"
      )
      .then((response) => {
        setCategories(response.data); // Set fetched categories
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const intro = `
    Our website offers comprehensive educational resources covering all
    major tracks in computer science, including software development,
    networking, artificial intelligence, and cybersecurity. Explore
    tailored courses and materials to enhance your skills and advance
    your career in the tech industry.
`.trim();

  const theme = useTheme();
  return (
    <div>
      <Box sx={{ width: "80%", m: "auto",}}>
        
        <IntroductionSection title="Hi!" content={intro} />

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
            (category) => category.category.toLowerCase() !== "start here"
          )
          .map((category) => {
            const filteredRoadmaps = roadmaps.filter(
              (roadmap) =>
                roadmap.roadmapData.roadmapCategory === category.category
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
                    {category.category}
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
                            alt={`${category.category.toLowerCase()} img`}
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
