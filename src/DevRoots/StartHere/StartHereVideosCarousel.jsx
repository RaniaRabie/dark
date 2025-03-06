import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";
// import required modules
import { Parallax, Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";

export default function StartHereVideosCarousel() {
    const [videos, setVideos] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("http://localhost:3100/carouselData");
        setVideos(response.data || []); // Set empty array if slides is undefined
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load carousel data.");
      }
    };

    fetchSlides();
  }, []);
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        effect={"fade"}
        keyboard={{
          enabled: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]} // Register all modules
        className="mySwiper"
        
      >
        {videos.map((video) => (
          <SwiperSlide key={video.img}>
            <img src={video.src} alt={video.alt} />
          </SwiperSlide>
        ))}

        
      </Swiper>
    </>
  );
}
