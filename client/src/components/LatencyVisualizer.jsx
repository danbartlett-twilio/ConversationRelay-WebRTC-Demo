import React, { useState } from "react";
// import PieChart from "./PieChart";

import { Box, Label, Button } from "@twilio-paste/core";

const LatencyVisualizer = (props) => {
  const [responseTime, setResponseTime] = useState([]);

  const randomTimeout = () => {
    let timeoutLength = Math.random() * 2000; //random number between 0-2000
    console.log("making request...");
    setTimeout(() => {
      console.log(`request completed in ${timeoutLength} ms`);
      setResponseTime([...responseTime, timeoutLength]);
    }, timeoutLength);
  };

  const averageResponseTime = () => {
    if (responseTime.length > 0) {
      const averageResponseTime =
        responseTime.reduce((prev, curr) => prev + curr) / responseTime.length;
      console.log(`average response time is ${averageResponseTime} ms`);
    } else {
      console.log("no requests made");
    }
  };

  const handleTest = () => {
    randomTimeout();
  };

  return (
    <Box>
      <Label htmlFor="statusArea">Latency</Label>
      <Button onClick={handleTest}>Random Timeout</Button>
      <Button onClick={averageResponseTime} variant="secondary">
        Get Average Reponse
      </Button>
      {/* <PieChart width="100" height="100" /> */}
    </Box>
  );
};
export default LatencyVisualizer;
