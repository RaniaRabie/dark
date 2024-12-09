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
  Carousel.css
  }
- Contributors:
- Last Modified Date: 17/10/2024
- Description : a carousel file 
*/
import axios from "axios";
import React, { useEffect, useState } from "react";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Carousel.css"
export default function Carousel() {
  const [slides, setSlides] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("http://localhost:3100/slides");
        setSlides(response.data || []); // Set empty array if slides is undefined
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load carousel data.");
      }
    };

    fetchSlides();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <div className="carousel">
      <NavigateBeforeIcon onClick={prevSlide} className="arrow arrow-left" />
      {slides.length > 0 ? (
        slides.map((slide, index) => (
          <img
            src={slide.src}
            alt={slide.alt}
            key={index}
            className={slide === index ? "slide" : "slide slide-hidden"}
          />
        ))
      ) : (
        <p>Loading slides...</p>
      )}
      <NavigateNextIcon onClick={nextSlide} className="arrow arrow-right" />
      <span className="indicators">
        {slides.map((_, index) => {
          return (
            <button
              key={index}
              className={
                currentSlide === index
                  ? "indicator"
                  : "indicator indicator-inactive"
              }
              onClick={() => setCurrentSlide(index)}
            ></button>
          );
        })}
      </span>
    </div>
  );
}
