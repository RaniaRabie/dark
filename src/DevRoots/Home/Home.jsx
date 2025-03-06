import React from "react";
import RoadmapList from "./RoadmapList";
import Carousel from "./Carousel/Carousel";
import DoneIcon from '@mui/icons-material/Done';

export default function Home() {
  return (
    <>
      <Carousel />
      {/* <RoadmapList /> */}

      <div className="section_2">
        <div className="strategy">
            <div className="Strategy_header">
                <h2 className="Strategy_title">Aims & Objectives</h2>
                <span className="Strategy_line"></span>
             </div> 
            <span className="strategy_header_des">Develop an interactive Career Guidance platform tailored for Arab’s individuals
               who are just starting their career journey. The platform will simplify the learning process
                by providing structured roadmaps, essential foundational knowledge, and practical resources 
                to help users confidently begin and progress in their chosen tracks.</span>
            <div className="check_with_span">
                {/* <i className="fa-solid fa-check"></i>     */}
            <DoneIcon sx={{ color: "#ee6d4f" }} />
                <span className="strategy_span">Provide Clear Learning Roadmaps.</span>
                {/* <p className="strategy_p">Lorem ipsum dolor sit amet, consectetur adipisicing elit </p> */}
            </div>

            <div className="check_with_span">
            <DoneIcon sx={{ color: "#ee6d4f" }} />
                <span className="strategy_span">Focus on Essential Fundamentals.</span>
            </div>
            <div className="check_with_span">
            <DoneIcon sx={{ color: "#ee6d4f" }} />
                <span className="strategy_span">Enhance Awareness through Expert Insights.</span>
            </div>
            <div className="check_with_span">
            <DoneIcon sx={{ color: "#ee6d4f" }} />
            <span className="strategy_span">Foster a Supportive Learning Community.</span>
            </div>
        </div>

        <div className="chair_img">
            <img src="https://res.cloudinary.com/dlnxfhrfs/image/upload/v1738515761/cg%20images/oiubvszzfdebddgkk8we.png" alt="" width="460" ></img>
            
            <ul className="sterategy_img_bullets">
                <li className="active_bullet"></li>
                <li></li>
                <li></li>
            </ul>
        </div>

    </div>


    </>
  );
}
