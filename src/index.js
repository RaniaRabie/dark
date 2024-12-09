/*
- File Name: index.js
- Author: rania rabie
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  App,
  reportWebVitals,
  BrowserRouter,
  GoogleOAuthProvider,
  RoadmapProvider
  }
- Contributors: rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : display all content of App file 
*/
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RoadmapProvider } from "./Dashboard/pages/roadmap/create/RoadmapContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="863819354066-fafo7lel76kd78g15q5bf391t0mrvmuj.apps.googleusercontent.com">
        <RoadmapProvider>
          <App />
        </RoadmapProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
