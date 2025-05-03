/*
- File Name: App.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.1.0
- Dependencies:
  {
  REACT , 
  DevRootsOutlet,
  RoadmapList,
  Login,
  SignUp,
  ForgotPassword,
  SetNewPassword,
  Roadmap,
  DashboardOutlet,
  Dashboard,
  BarChart,
  PieChart,
  LineChart,
  AllUsers,
  AddNewUser,
  Profile,
  FAQ,
  Setting,
  AllRoadmaps,
  RoadmapDetails,
  CreateRoadmap,
  App.css
  }
- Contributors: rania rabie,nourhan khaled, shrouk ahmed
- Last Modified Date: 10/12/2024
- Description : rendering all websites routes
*/

import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import DevRootsOutlet from "./DevRoots/DevRootsOutlet";
import RoadmapList from "./DevRoots/pages/Allroadmaps/RoadmapList";
import ForgotPassword from "./DevRoots/pages/login/Forget Password/ForgotPassword";
import SetNewPassword from "./DevRoots/pages/login/Forget Password/SetNewPassword";
import Roadmap from "./DevRoots/pages/roadmap/Roadmap";
import DashboardOutlet from "./Dashboard/DashboardOutlet";
import Dashboard from "./Dashboard/pages/dashboard/Dashboard";
import BarChart from "./Dashboard/pages/Analystics/BarChart";
import PieChart from "./Dashboard/pages/Analystics/PieChart";
import LineChart from "./Dashboard/pages/Analystics/LineChart";
import AllUsers from "./Dashboard/pages/form/users/AllUsers";
import AddNewUser from "./Dashboard/pages/form/users/AddNewUser";
import Profile from "./Dashboard/pages/form/users/Profile";
import FAQ from "./Dashboard/pages/faq/FAQ";
import Setting from "./Dashboard/pages/setting/Setting";
import AllRoadmaps from "./Dashboard/pages/roadmap/create/AllRoadmaps";
import RoadmapDetails from "./Dashboard/pages/roadmap/create/Roadmapdetails";
import CreateRoadmap from "./Dashboard/pages/roadmap/create/CreateRoadmap";
import AllFields from "./Dashboard/pages/roadmap/fields/AllFields";
import AddField from "./Dashboard/pages/roadmap/fields/AddField";
import Regesteration from "./DevRoots/pages/login/Regesteration";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./error/Unauthorized";
import NotFound from "./error/NotFound";
import NewCarouselSection from "./Dashboard/pages/Carousel/NewCarouselSection";
import NewCarousel from "Dashboard/pages/Carousel/NewCarousel";
import Home from "./DevRoots/Home/Home";
import StartHere from "./DevRoots/pages/StartHere/StartHere";
import AllCarousel from "./Dashboard/pages/Carousel/AllCarousel";
import Settingg from "./DevRoots/pages/userProfile/Settingg";
import SocialMedia from "./DevRoots/pages/userProfile/SocialMedia";
import UpdateUser from "./DevRoots/pages/userProfile/UpdateUser";
import Security from "Dashboard/pages/setting/Security";
import AboutUs from "DevRoots/pages/aboutUs/AboutUs";
import SocialMediaAdmin from "Dashboard/pages/setting/SocialMediaAdmin";

function App() {

  return (
    <Routes>
      {/* devroots paths */}
      <Route path="/" element={<DevRootsOutlet />}>
        <Route index element={<Home />} />
        <Route path="allroadmaps" element={<RoadmapList/>} />
        <Route path="registration" element={<Regesteration />} />
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="SetNewPassword" element={<SetNewPassword />} />
        <Route path="roadmap/:id" element={<Roadmap />} />
        <Route path="startHere" element={<StartHere />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="/Settingg" element={<Settingg />} />
        <Route path="/SocialMedia" element={<SocialMedia />} />
        <Route path="/userProfile" element={<UpdateUser />}/>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Dashboard paths */}

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["admin" , "Admin"]}>
            <DashboardOutlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard/>} />
        <Route path="piechart" element={<PieChart />} />
        <Route path="linechart" element={<LineChart />} />
        <Route path="barchart" element={<BarChart />} />
        <Route path="allusers" element={<AllUsers />} />
        <Route path="addnewuser" element={<AddNewUser />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="setting" element={<Setting />} />
        <Route path="Security" element={<Security />} />
        <Route path="SocialMedia" element={<SocialMediaAdmin />}/>
        <Route path="allroadmaps" element={<AllRoadmaps />} />
        <Route path="create" element={<CreateRoadmap />} />
        <Route path="create/:id" element={<CreateRoadmap />} />
        <Route path="details" element={<RoadmapDetails />} />
        <Route path="details/:id" element={<RoadmapDetails />} />
        <Route path="allfields" element={<AllFields />} />
        <Route path="addfield" element={<AddField />} />
        <Route path="addfield/:id" element={<AddField />} />
        <Route path="newCarouselSection" element={<NewCarouselSection />} />
        <Route path="newCarousel" element={<NewCarousel />} />
        <Route path="allCarousel" element={<AllCarousel />} />
        <Route path="newCarousel/:id" element={<NewCarousel />} />
        <Route path="*" element={<NotFound />} />

      </Route>

      {/* NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
