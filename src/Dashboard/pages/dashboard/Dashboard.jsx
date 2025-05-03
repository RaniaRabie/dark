// /*
// - File Name: Dashboard.jsx
// - Author: shrouk ahmed
// - Date of Creation: 17/9/2024
// - Versions Information: 1.0.0
// - Dependencies:
//   {
//   REACT ,
//   MUI ,
//   react-router-dom ,
//   framer-motion,
//   recharts,
//   Dashboard.css,
//   App.css
//   }
// - Contributors: shrouk ahmed , rania rabie,nourhan khaled
// - Last Modified Date: 1/11/2024
// - Description : Dashboard Home that display some of analytics
// */

import React from "react";
import { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import { minWidth, styled } from "@mui/system";
import { motion } from "framer-motion";
import { People, BarChart, AccessTime } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as ReBarChart,
  Bar,
} from "recharts";
import SourceIcon from "@mui/icons-material/Source";
import "./Dashboard.css"; // Import the CSS file
import "../../../App.css";
import { api } from "../../../services/axiosInstance";



// InfoCard component with hover effect
const InfoCard = ({ title, value, icon, style }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.5 }}
  >
<Card className="card" style={{ ...style, minWidth: "250px"}}>
{" "}
      {/* Apply the inline style here */}
      <CardContent>
        <Typography variant="h6" style={{ color: "white" }}>
          {title}
        </Typography>
        <Typography variant="h4" style={{ color: "white" }}>
          {value}
        </Typography>
        {icon && <Box>{icon}</Box>}
      </CardContent>
    </Card>
  </motion.div>
);

// Data for the charts
const visitsData = [
  { name: "Jan", visits: 4000 },
  { name: "Feb", visits: 3000 },
  { name: "Mar", visits: 2000 },
  { name: "Apr", visits: 2780 },
  { name: "May", visits: 1890 },
];

const revenueData = [
  { name: "Jan", revenue: 2400 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2800 },
  { name: "Apr", revenue: 3500 },
];

export default function Dashboard() {
  const [newUsersCount, setNewUsersCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/Dashboard/GetAllUsers");
        const data = response.data; // assuming you're using axios
        const newUsers = data.filter((user) => user).length;
        setNewUsersCount(newUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{marginLeft:"45px"}}>
      <Box display={"flex"} gap={2} justifyContent={"space-between"} flexWrap={"wrap"} sx={{mb:2}}>
        
        <Box >
          <InfoCard
            title="Total Visits"
            value="12,345"
            icon={<People />}
            style={{ backgroundColor: "#ee6c4d", color: "white" }}
          />
        </Box>
        <Box >
          <InfoCard
            title="Conversion Rate"
            value="30%"
            icon={<BarChart />}
            style={{ backgroundColor: "#3c6e71", color: "white" }}
          />
        </Box>
        <Box >
          <InfoCard
            title="Our Users"
            value={newUsersCount}
            icon={<AccessTime />}
            style={{ backgroundColor: "#284b63", color: "white" }}
          />
        </Box>
        <Box >
          <InfoCard
            title="Most Used Courses"
            value="5"
            icon={<SourceIcon />}
            style={{ backgroundColor: "#293241", color: "white" }}
          />
        </Box>
      </Box>

      {/* charts */}
      <Grid container spacing={2}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6">Site Visits Over Time</Typography>
              <Divider />
              <LineChart width={500} height={300} data={visitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        {/* New Bar Chart - Revenue by Month */}
        <Grid item xs={12} md={6}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h5">Revenue by Month</Typography>
              <Divider />
              <ReBarChart width={300} height={300} data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#ee6c4d" />
              </ReBarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
