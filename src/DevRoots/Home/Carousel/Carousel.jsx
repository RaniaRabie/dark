// /*
// - File Name: RoadmapList.jsx
// - Author: rania rabie
// - Date of Creation: 17/9/2024
// - Versions Information: 1.0.0
// - Dependencies:
//   {
//   REACT ,
//   MUI ,
//   axios,
//   Carousel.css
//   }
// - Contributors:
// - Last Modified Date: 17/10/2024
// - Description : a carousel file
// */
// import axios from "axios";
// import React, { useEffect, useState, useRef } from "react";
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import "./styles.css";
// // import required modules
// import {
//   Parallax,
//   Pagination,
//   Navigation,
//   Autoplay,
//   EffectFade,
// } from "swiper/modules";
// import { Box, Divider, Link, Stack, Typography, useTheme } from "@mui/material";

// export default function Carousel() {
//   const [slides, setSlides] = useState([]); // Initialize as an empty array
//   const [allCarouselSections, setAllCarouselSections] = useState([]);

//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch all roadmaps from the JSON server
//     axios
//       .get("http://localhost:3100/carouselData")
//       .then((response) => {
//         setSlides(response.data || []); // Set the fetched and parsed roadmaps
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error("Failed to load carousel data:", error);
//       });

//     // Fetch all Carousel Sections from the server
//     axios
//       .get("http://localhost:3100/newCarouselSection")
//       .then((response) => {
//         setAllCarouselSections(response.data); // Set fetched categories
//       })
//       .catch((error) => {
//         console.error("Error fetching Carousel Sections:", error);
//       });
//   }, []);
//   const theme = useTheme();

//   const homeSection = allCarouselSections.find(
//     (section) => section.newCarouselSection.toLowerCase() === "home"
//   );

//   if (!homeSection) {
//     return (
//       <Typography
//         variant="body1"
//         color={theme.palette.text.primary}
//         sx={{ mt: 2, textAlign: "center" }}
//       >
//         No Home section found.
//       </Typography>
//     );
//   }

//   const filteredSlides = slides.filter(
//     (slide) => slide.selectCarouselSection === homeSection.newCarouselSection
//   );

//   return (
//     <>
//       <Swiper
//         slidesPerView={1}
//         spaceBetween={30}
//         // effect={"fade"}
//         // keyboard={{
//         //   enabled: true,
//         // }}
//         autoplay={{
//           delay: 2500,
//           disableOnInteraction: false,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Autoplay, Pagination, Navigation, EffectFade]} // Register all modules
//         className="mySwiper"
//       >
//         <div key={homeSection.id}>
//           {filteredSlides.length > 0 ? (
//             <Stack
//               direction="row"
//               sx={{
//                 gap: 2,
//                 flexWrap: "wrap",
//                 justifyContent: { xs: "center", sm: "flex-start" },
//               }}
//             >
//               <Box
//                 sx={{ border: "3px solid red", width: 250, height: "100vh" }}
//               >
//                 {filteredSlides.map((slide) => (
//                   <SwiperSlide key={slide.id}>
//                     {/* <Typography variant="body1" color="initial">{slide.carouselDes}</Typography> */}
//                     <img
//                       src={slide.carouselImg}
//                       alt=""
//                       style={{

//                       }}
//                     />
//                   </SwiperSlide>
//                 ))}
//               </Box>
//             </Stack>
//           ) : (
//             <Typography
//               variant="body1"
//               color={theme.palette.text.primary}
//               sx={{ mt: 2, textAlign: "center" }}
//             >
//               Roadmaps will be added soon...
//             </Typography>
//           )}
//         </div>
//       </Swiper>
//     </>
//   );
// }

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

import "./styles.css";

// Import required Swiper modules
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";

import { Box, Typography, useTheme } from "@mui/material";

export default function Carousel() {
  const [slides, setSlides] = useState([]);
  const [allCarouselSections, setAllCarouselSections] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    // Fetch carousel slides data
    axios
      .get("http://localhost:3100/carouselData")
      .then((response) => {
        setSlides(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to load carousel data:", error);
      });

    // Fetch carousel sections data
    axios
      .get("http://localhost:3100/newCarouselSection")
      .then((response) => {
        setAllCarouselSections(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Carousel Sections:", error);
      });
  }, []);

  // Find the "home" section (ignoring case)
  const homeSection = allCarouselSections.find(
    (section) => section.newCarouselSection.toLowerCase() === "home"
  );

  if (!homeSection) {
    return (
      <Typography
        variant="body1"
        color={theme.palette.text.primary}
        sx={{ mt: 2, textAlign: "center" }}
      >
        No Home section found.
      </Typography>
    );
  }

  // Filter slides that belong to the home section
  const filteredSlides = slides.filter(
    (slide) => slide.selectCarouselSection === homeSection.newCarouselSection
  );

  return (
    // Outer Box fills the full viewport
    <Box sx={{ width: "100%", height: "calc(100vh)" }}>
      {" "}
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper"
        // Ensure the Swiper itself takes up the full space of its container
        style={{ width: "100%", height: "100%" }}
      >
        {filteredSlides.length > 0 ? (
          filteredSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={slide.carouselImg}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Typography
              variant="body1"
              color={theme.palette.text.primary}
              sx={{ mt: 2, textAlign: "center" }}
            >
              Roadmaps will be added soon...
            </Typography>
          </SwiperSlide>
        )}
      </Swiper>
    </Box>
  );
}
