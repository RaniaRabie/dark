/*
- File Name: RoadmapList.jsx
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
    REACT, 
    MUI,
    axios,
    Carousel.css
  }
- Contributors:
- Last Modified Date: 17/10/2024
- Description : a carousel file 
*/

import axios from "axios";
import React, { useEffect, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../styles.css";

// Import required Swiper modules
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";

import { Box, Typography, useTheme } from "@mui/material";
import {api} from "../../../services/axiosInstance"

export default function Carousel() {
  const [slides, setSlides] = useState([]);
  const [filteredSlides, setFilteredSlides] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    api
      .get(
        "/api/Dashboard/GetAllDetailsCarouselSection"
      )
      .then((response) => {
        const allSlides = response.data || [];
        setSlides(allSlides); // Optional: if you still need the full list somewhere else
        const homeSlides = allSlides.filter(
          (slide) =>
            slide.carouselSection &&
            slide.carouselSection.trim().toLowerCase() === "home"
        );
        setFilteredSlides(homeSlides);
      })
      .catch((error) => {
        console.error("Failed to load carousel data:", error);
      });
  }, []);

  return (
    // Outer Box fills the full viewport
    <Box
      sx={{
        width: "100%",
        // height: "100vh",
        overflow: "hidden", // Prevent scrollbars
      }}
    >
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Pause on hover for better UX
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true, // Optimize for many slides
        }}
        navigation
        effect="fade"
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper"
        style={{ width: "100%", height: "100%" }}
        // Improve performance with lazy loading
        lazyPreloadPrevNext={1}
      >
        {filteredSlides.length > 0 ? (
          filteredSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  display: "flex", // Ensure proper alignment
                }}
              >
                <img
                  src={slide.carouselImg}
                  alt={slide.altText || "Carousel image"} // Add meaningful alt text
                  loading="lazy" // Lazy load images
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body1"
                color={theme.palette.text.primary}
                sx={{ textAlign: "center" }}
              >
                Carousel will be added soon...
              </Typography>
            </Box>
          </SwiperSlide>
        )}
      </Swiper>
    </Box>
  );
}
