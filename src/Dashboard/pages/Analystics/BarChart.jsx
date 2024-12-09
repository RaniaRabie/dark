/*
- File Name:BarChart.jsx
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
- Description : BarChart
*/
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

const data = [
  { year: 2019, Spain: 900, France: 1400, Germany: 1700, Egypt: 500 },
  { year: 2020, Spain: 1000, France: 1500, Germany: 1800, Egypt: 700 },
  { year: 2021, Spain: 1100, France: 1600, Germany: 1900, Egypt: 900 },
  { year: 2022, Spain: 1200, France: 1700, Germany: 2000, Egypt: 1100 },
  { year: 2023, Spain: 1260, France: 1709, Germany: 2080, Egypt: 1470 },
];

export default function Bar() {
  const theme = useTheme();

  return (
    <Box sx={{ height: "70vh"}}>
      <Typography  sx={{ fontSize:"20px", textAlign:'center', color : theme.palette.text.primary}}>BarChart</Typography>
      <ResponsiveBar
        data={data}
        keys={["Spain", "France", "Germany", "Egypt"]}
        indexBy="year"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={['#98c1d9', '#3d5a80', '#293241', '#ee6c4d']} // Ensure color order matches keys
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Year",
          legendPosition: "middle",
          legendOffset: 35,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Salary / Month",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#ffffff"
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      />
    </Box>
  );
}
