import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./CarouselStyles.css";

// Import required Swiper modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import {
  ImageListItem,
  ImageListItemBar,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const imgStyle = {
  width: "100%",
  maxWidth: "280px",
  height: "230px",
  objectFit: "cover",
  borderRadius: "10px",
};

// Styled component for the state tag
const StateTag = styled(Box)(({ theme, state }) => ({
  position: "absolute",
  top: 7,
  right: 7,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: "10px",
  background:"rgba(0, 0, 0, 0.7)",

  backdropFilter: "blur(4px)",
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.2)"
      : "1px solid rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  // Color coding based on state
  color:
    state === "New"
      ? "#2ecc71" // Green for New
      : state === "Trending"
      ? "#ee6d4f" // Coral for Trending (theme's text.main)
      : "#3498db", // Blue for Updated
  "& svg": {
    fontSize: "14px",
  },
  "& .MuiTypography-root": {
    fontWeight: "bold",
    fontSize: "0.8rem",
    textTransform: "capitalize",
  },
}));

export default function Carousel({ items }) {
  const theme = useTheme();

  // Map carouselState to corresponding icon
  const getStateIcon = (state) => {
    switch (state) {
      case "New":
        return <NewReleasesIcon />;
      case "Trending":
        return <TrendingUpIcon />;
      case "Updated":
        return <TipsAndUpdatesIcon />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
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
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        breakpoints={{
          // When screen width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // When screen width is >= 640px
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          // When screen width is >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // When screen width is >= 1280px
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Link to={item.carouselUrl} style={{ textDecoration: "none" }}>
              <ImageListItem sx={{ position: "relative" }}>
              {item.carouselState && (
                  <StateTag state={item.carouselState}>
                    <Typography>{item.carouselState}</Typography>
                    {getStateIcon(item.carouselState)}
                  </StateTag>
                )}

                <img
                  // @ts-ignore
                  style={imgStyle}
                  src={`${item.carouselImg}`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  sx={{ borderRadius: "10px" }}
                  title={item.carouselTitle}
                  subtitle={item.carouselDes}
                />
              </ImageListItem>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
