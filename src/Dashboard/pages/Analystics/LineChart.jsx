/*
- File Name:LineChart.jsx
- Author: shrouk ahmed
- Date of Creation: 17/9/2024
- Versions Information: 1.0.0
- Dependencies:
  {
  REACT , 
  MUI ,
  @nivo
  }
- Contributors: shrouk ahmed , rania rabie,nourhan khaled
- Last Modified Date: 1/11/2024
- Description : LineChart
*/
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "japan",
    color: "blue", // Change to a shade of blue
    data: [
      { x: "plane", y: 298 },
      { x: "helicopter", y: 59 },
      { x: "boat", y: 249 },
      { x: "train", y: 74 },
      { x: "subway", y: 212 },
      { x: "bus", y: 152 },
      { x: "car", y: 134 },
      { x: "moto", y: 231 },
      { x: "bicycle", y: 227 },
      { x: "horse", y: 202 },
    ],
  },
  {
    id: "us",
    color: "darkblue", // Change to a darker shade of blue
    data: [
      { x: "plane", y: 17 },
      { x: "helicopter", y: 88 },
      { x: "boat", y: 80 },
      { x: "train", y: 14 },
      { x: "subway", y: 216 },
      { x: "bus", y: 195 },
      { x: "car", y: 24 },
      { x: "moto", y: 174 },
      { x: "bicycle", y: 237 },
      { x: "horse", y: 41 },
    ],
  },
  {
    id: "germany",
    color: "skyblue", // Lighter shade of blue
    data: [
      { x: "plane", y: 37 },
      { x: "helicopter", y: 152 },
      { x: "boat", y: 184 },
      { x: "train", y: 10 },
      { x: "subway", y: 173 },
      { x: "bus", y: 50 },
      { x: "car", y: 30 },
      { x: "moto", y: 204 },
      { x: "bicycle", y: 114 },
      { x: "horse", y: 243 },
    ],
  },
  {
    id: "norway",
    color: "deepskyblue", // Another shade of blue
    data: [
      { x: "plane", y: 198 },
      { x: "helicopter", y: 50 },
      { x: "boat", y: 168 },
      { x: "train", y: 192 },
      { x: "subway", y: 154 },
      { x: "bus", y: 36 },
      { x: "car", y: 66 },
      { x: "moto", y: 238 },
      { x: "bicycle", y: 204 },
      { x: "horse", y: 209 },
    ],
  },
];

export default function Line() {
  const theme = useTheme();

  return (
    <Box sx={{ height: "75vh", mx: "auto" }}>
      <Typography
        sx={{
          fontSize: "20px",
          textAlign: "center",
          color: theme.palette.text.primary,
        }}
      >
        Line Chart
      </Typography>

      <ResponsiveLine
        data={data}
        colors={["#3d5a80", "#ee6c4d", "#98c1d9", "#293241"]}
        theme={{
          text: {
            fontSize: 11,
            fill: theme.palette.text.primary,
            outlineWidth: 0,
            outlineColor: "transparent",
          },
          axis: {
            domain: {
              line: {
                stroke: theme.palette.divider,
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: "transparent",
              },
            },
            ticks: {
              line: {
                stroke: theme.palette.divider,
                strokeWidth: 1,
              },
              text: {
                fontSize: 11,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: "transparent",
              },
            },
          },
          grid: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 0,
            },
          },
          legends: {
            title: {
              text: {
                fontSize: 11,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: "transparent",
              },
            },
            text: {
              fontSize: 11,
              fill: theme.palette.text.primary,
              outlineWidth: 0,
              outlineColor: "transparent",
            },
            ticks: {
              line: {},
              text: {
                fontSize: 10,
                fill: theme.palette.text.primary,
                outlineWidth: 0,
                outlineColor: "transparent",
              },
            },
          },
          tooltip: {
            container: {
              background: theme.palette.background.default,
              color: theme.palette.text.primary,
              fontSize: 12,
            },
          },
        }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Transportation",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
}
