// src/pages/Login.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css"; // Import Login-specific CSS

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
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

  const handleLogin = async () => {
    if (isLoading) return;
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Failed to login. Please check your credentials and try again.");
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/"); // Navigate to home page. Adjust the path if your Home route differs.
  };

  return (
    <div className="login-wrapper">
      <canvas ref={canvasRef} className="login-matrix-canvas"></canvas>
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <div className="button-group">
          <button
            onClick={handleLogin}
            className="login-button"
            disabled={isLoading}
            aria-label="Login Button"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={goBack}
            className="back-button"
            aria-label="Go Back Button"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
