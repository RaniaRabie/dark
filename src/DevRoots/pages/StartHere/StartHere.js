import { Box, Divider } from "@mui/material";

import StarthereRoadmap from "./StarthereRoadmap";
import IntroductionSection from "DevRoots/components/IntroductionSection";
import Carousel from "DevRoots/components/Carousel/Carousel";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";

// Define reusable styles as a constant
const containerStyles = {
  width: "80%",
  margin: "0 auto",
};

export default function StartHere() {
  const [slides, setSlides] = useState([]);
    const [carouselSections, setCarouselSections] = useState([]);
  



    // Fetch all carousel sections
  const fetchCarouselSections = async () => {
    try {
      const response = await axios.get(
        "https://careerguidance.runasp.net/api/Dashboard/GetAllCarouselSection"
      );
      setCarouselSections(response.data);
      console.log("Fetched sections:", response.data);
    } catch (error) {
      console.error("Error fetching sections:", error);

    }
  };


  useEffect(() => {
    axios
      .get(
        "https://careerguidance.runasp.net/api/Dashboard/GetAllDetailsCarouselSection"
      )
      .then((response) => {
        setSlides(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to load carousel data:", error);
      });


      fetchCarouselSections();
  }, []);

  // Define content once if it’s reused
  const sharedContent = `
    is designed to equip learners with the essential skills needed to
    create visually appealing, user-friendly, and responsive websites.
    This track focuses on the client-side of web applications,
    covering topics like HTML, CSS, JavaScript, and modern front-end
    frameworks such as React, Angular, or Vue.js
  `.trim();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={containerStyles}>
        <IntroductionSection
          title="Why this section is important for every developer"
          content={sharedContent}
        />

        <StarthereRoadmap/>

        {carouselSections
          .filter(
            (section) => section.newCarouselSection.toLowerCase() !== "home"
          )
          .map((section) => {
            const filteredSections = slides.filter(
              (slide) =>
                slide.carouselSection === section.newCarouselSection
            );

            return (
              <div key={section.id}>
                <Divider textAlign="left" sx={{ mb: 2 }}>
                  <h3
                    style={{
                      border: "1px solid #EE6C4D",
                      borderRadius: "7px",
                      padding: "2px",
                    }}
                  >
                    {section.newCarouselSection}
                  </h3>
                </Divider>
                <Carousel items={filteredSections} />
              </div>
            );
          })}
      </Box>
    </Box>
  );
}
