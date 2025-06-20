import React, { useEffect, useRef } from "react";
import { Avatar, Box, Flex, Heading, Card, Button } from "@twilio-paste/core";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import { ProductAutopilotIcon } from "@twilio-paste/icons/esm/ProductAutopilotIcon";

import botImage from "../images/bot.png";

const Audiovisualizer = ({ localAnalyser, remoteAnalyser }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!localAnalyser || !remoteAnalyser) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    remoteAnalyser.fftSize = 1024;
    localAnalyser.fftSize = 1024;
    const localData = new Uint8Array(localAnalyser.frequencyBinCount);
    const remoteData = new Uint8Array(remoteAnalyser.frequencyBinCount);

    const resizeCanvas = () => {
      requestAnimationFrame(() => {
        const { width, height } = container.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      });
    };

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    resizeCanvas();

    const draw = () => {
      requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Remote analyser
      ctx.fillStyle = "#0E7C3A";
      const remoteBarWidth = (width * 2) / remoteData.length;
      remoteAnalyser.getByteFrequencyData(remoteData);
      remoteData.forEach((val, i) => {
        const barHeight = (val / 255) * centerY;
        const x = i * remoteBarWidth;
        ctx.fillRect(x, centerY - barHeight, remoteBarWidth - 1, barHeight * 2);
      });

      // Local analyser
      ctx.fillStyle = "#2196f3";
      const localBarWidth = (width * 2) / localData.length;
      localAnalyser.getByteFrequencyData(localData);
      const MIN_THRESHOLD = 100;
      localData.forEach((val, i) => {
        const barHeight = val < MIN_THRESHOLD ? 0 : (val / 255) * centerY;
        const x = width - (i + 1) * localBarWidth;
        ctx.fillRect(x, centerY - barHeight, localBarWidth - 1, barHeight * 2);
      });

      ctx.strokeStyle = "#666";
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
    };

    draw();

    return () => observer.disconnect();
  }, [localAnalyser, remoteAnalyser]);

  return (
    <Card padding="space120">
      <Heading as="h1" variant="heading30" marginBottom="space40">
        Audio Visualizer
      </Heading>
      <Box width="100%" display={["flex", "flex", "flex"]}>
        <Avatar
          size="sizeIcon110"
          name="Conversation Relay Avatar"
          icon={ProductAutopilotIcon}
          color="decorative30"
        />
        <Box flexGrow={1} paddingX={"space50"}>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "60px",
              display: "block",
            }}
          />
        </Box>
        <Avatar
          size="sizeIcon110"
          name="User Avatar"
          icon={AgentIcon}
          color="decorative20"
        />
      </Box>
    </Card>
  );
};

export default Audiovisualizer;
