// src/pages/Home.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import Home-specific CSS

const Home: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = Array.from({ length: 300 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 57) + 33)
    );

    const fontSize = 16;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(0);
    let animationFrameId: number;

    const drawMatrix = () => {
      // Lower opacity to reduce greyish tint
      ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear the canvas with lower opacity

      ctx.fillStyle = "#0F0"; // Matrix green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height || Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array(columns).fill(0);
    };

    // Initialize canvas size
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    // Start the animation
    drawMatrix();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="home-wrapper">
      <canvas ref={canvasRef} className="home-matrix-canvas"></canvas>
      <div className="home-card">
        <h1 className="home-title">DadLink</h1>
        <p className="home-subtitle">Stay connected, Your ultimate family tool.</p>
        <div className="home-buttonContainer">
          <button
            onClick={() => navigate("/login")}
            className="home-button"
            aria-label="Navigate to Login Page"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="home-button"
            aria-label="Navigate to Sign Up Page"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

