/*
- File Name: App.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
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
- Last Modified Date: 1/11/2024
- Description : rendering all websites routes
*/

import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import DevRootsOutlet from "./DevRoots/DevRootsOutlet";
import RoadmapList from "./DevRoots/Home/RoadmapList";
import ForgotPassword from "./DevRoots/pages/login/Forget Password/ForgotPassword";
import SetNewPassword from "./DevRoots/pages/login/Forget Password/SetNewPassword";
import Roadmap from "./DevRoots/roadmap/Roadmap";
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
import AllFields from "./Dashboard/pages/roadmap/create/fields/AllFields";
import AddField from "./Dashboard/pages/roadmap/create/fields/AddField";
import Regesteration from "./DevRoots/pages/login/Regesteration";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./Unauthorized/Unauthorized";

function App() {
  
  return (
    <Routes>
      {/* devroots paths */}
      <Route path="/" element={<DevRootsOutlet />}>
        <Route index element={<RoadmapList />} />
        <Route path="regesteration" element={<Regesteration />} />
        <Route path="ForgotPassword" element={<ForgotPassword />} />
        <Route path="SetNewPassword" element={<SetNewPassword />} />
        <Route path="roadmap/:id" element={<Roadmap />} />
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
        <Route index element={<Dashboard newUsersCount={undefined} />} />
        <Route path="piechart" element={<PieChart />} />
        <Route path="linechart" element={<LineChart />} />
        <Route path="barchart" element={<BarChart />} />
        <Route path="allusers" element={<AllUsers />} />
        <Route path="addnewuser" element={<AddNewUser />} />
        <Route path="profile" element={<Profile />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="setting" element={<Setting />} />
        <Route path="allroadmaps" element={<AllRoadmaps />} />
        <Route path="create" element={<CreateRoadmap />} />
        <Route path="create/:id" element={<CreateRoadmap />} />
        <Route path="details" element={<RoadmapDetails />} />
        <Route path="details/:id" element={<RoadmapDetails />} />
        <Route path="allfields" element={<AllFields />} />
        <Route path="addfield" element={<AddField />} />
        <Route path="addfield/:id" element={<AddField />} />
      </Route>
    </Routes>
  );
}

export default App;
