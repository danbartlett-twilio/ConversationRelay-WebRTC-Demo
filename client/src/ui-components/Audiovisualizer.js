import React, { useEffect, useRef } from "react";

const AudioVisualizer = ({ analyser, color }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      dataArray.forEach((value, i) => {
        const barHeight = value / 2;
        ctx.fillRect(i * 4, canvas.height - barHeight, 3, barHeight);
      });
    }

    draw();
  }, [analyser, color]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={120}
      className="border rounded"
    />
  );
};

export default AudioVisualizer;
