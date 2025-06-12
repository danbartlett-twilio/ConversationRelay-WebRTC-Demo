// import React, { useEffect, useRef } from "react";
// import { Avatar, AvatarGroup, Stack } from "@twilio-paste/core";
// import { UserIcon } from "@twilio-paste/icons/esm/UserIcon";
// import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
// import { ProductAutopilotIcon } from "@twilio-paste/icons/esm/ProductAutopilotIcon";
// import botImage from "../images/bot.png";

// const Audiovisualizer = ({ localAnalyser, remoteAnalyser }) => {
//   const canvasRef = useRef();

//   useEffect(() => {
//     if (!localAnalyser || !remoteAnalyser) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const centerY = height / 2;

//     const localData = new Uint8Array(localAnalyser.frequencyBinCount);
//     const remoteData = new Uint8Array(remoteAnalyser.frequencyBinCount);

//     const resizeCanvas = () => {
//       const { width, height } = canvas.getBoundingClientRect();
//       canvas.width = width;
//       canvas.height = height;
//     };

//     const observer = new ResizeObserver(resizeCanvas);
//     observer.observe(canvas);

//     resizeCanvas(); // Set initial size

//     function drawWave() {
//       requestAnimationFrame(drawWave);

//       localAnalyser.getByteFrequencyData(localData);
//       remoteAnalyser.getByteFrequencyData(remoteData);

//       ctx.clearRect(0, 0, width, height);
//       const halfWidth = width;

//       // Remote (left side) Conversation Relay
//       ctx.fillStyle = "#f44336";
//       const remoteBarWidth = halfWidth / remoteData.length;
//       remoteData.forEach((val, i) => {
//         const barHeight = (val / 255) * (height / 2);
//         const x = i * remoteBarWidth;
//         ctx.fillRect(x, centerY - barHeight, remoteBarWidth - 1, barHeight * 2);
//       });

//       // Adjustable threshold to help with removing background noise with local microphone
//       const MIN_THRESHOLD = 100;

//       // Local (right side) User
//       ctx.fillStyle = "#2196f3";
//       const localBarWidth = halfWidth / localData.length;
//       localData.forEach((val, i) => {
//         const barHeight = val < MIN_THRESHOLD ? 0 : (val / 255) * (height / 2);
//         const x = width - (i + 1) * localBarWidth;
//         ctx.fillRect(x, centerY - barHeight, localBarWidth - 1, barHeight * 2);
//       });

//       // Center line
//       ctx.strokeStyle = "#666";
//       ctx.beginPath();
//       ctx.moveTo(0, centerY);
//       ctx.lineTo(width, centerY);
//       ctx.stroke();
//     }

//     drawWave();

//     return () => observer.disconnect();
//   }, [localAnalyser, remoteAnalyser]);

//   return (
//     <Stack orientation="horizontal" spacing="space40">
//       <Avatar
//         size="sizeIcon110"
//         name="Conversation Relay Avatar"
//         src={botImage}
//         color="decorative30"
//       />

//       {/* <canvas ref={canvasRef} width={500} height={120} /> */}

//       <canvas
//         ref={canvasRef}
//         style={{
//           width: "100%",
//           height: "120px",
//           display: "block",
//         }}
//       />

//       <Avatar
//         size="sizeIcon110"
//         name="User Avatar"
//         icon={AgentIcon}
//         color="decorative20"
//       />
//     </Stack>
//   );
// };

// export default Audiovisualizer;

import React, { useEffect, useRef } from "react";
import { Avatar, Stack, Box, Flex } from "@twilio-paste/core";
import { AgentIcon } from "@twilio-paste/icons/esm/AgentIcon";
import botImage from "../images/bot.png";

const Audiovisualizer = ({ localAnalyser, remoteAnalyser }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!localAnalyser || !remoteAnalyser) return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const ctx = canvas.getContext("2d");

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

      ctx.fillStyle = "#f44336";
      const remoteBarWidth = width / 2 / remoteData.length;
      remoteAnalyser.getByteFrequencyData(remoteData);
      remoteData.forEach((val, i) => {
        const barHeight = (val / 255) * centerY;
        const x = i * remoteBarWidth;
        ctx.fillRect(x, centerY - barHeight, remoteBarWidth - 1, barHeight * 2);
      });

      ctx.fillStyle = "#2196f3";
      const localBarWidth = width / 2 / localData.length;
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
    <Box width="100%" style={{ border: "1px solid red" }} display="flex">
      {/* <Stack orientation="horizontal" spacing="space40"> */}
      <Avatar
        size="sizeIcon110"
        name="Conversation Relay Avatar"
        src={botImage}
        color="decorative30"
      />
      <Box flexGrow={1}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "120px",
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
      {/* </Stack> */}
    </Box>
  );
};

export default Audiovisualizer;
