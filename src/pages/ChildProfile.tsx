// src/pages/Dashboard/ChildProfile.tsx

import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaVideo, 
  FaPhone, 
  FaRegPaperPlane, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const ChildProfile: React.FC = () => {
  // childId is the document ID in /users/{dadId}/children/{childId}
  const { childId } = useParams<{ childId: string }>();
  const [childData, setChildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ----------------------------
  // Matrix Animation for Background
  // ----------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
    const fontSize = 16;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, x) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, x * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    const interval = setInterval(drawMatrix, 50);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ----------------------------
  // Fetch Child Data
  // ----------------------------
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const dadId = auth.currentUser?.uid;
        if (!dadId) {
          alert("Dad ID not found! Please log in.");
          navigate("/login");
          return;
        }

        // We assume childId is the doc ID in /users/{dadId}/children/{childId}
        const docRef = doc(db, `users/${dadId}/children/${childId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setChildData(docSnap.data());
        } else {
          alert("Child not found!");
          navigate("/dad-dashboard");
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
        alert("An error occurred while fetching child data.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [childId, navigate]);

  // ----------------------------
  // Loading State
  // ----------------------------
  if (loading) {
    return (
      <div style={styles.wrapper}>
        <canvas ref={canvasRef} style={styles.canvas}></canvas>
        <div style={styles.overlay}>
          <div style={styles.card}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // If no child data, return null
  // ----------------------------
  if (!childData) {
    return null;
  }

  // ----------------------------
  // Handle Navigation to Chat
  // ----------------------------
  const handleOpenChat = () => {
    // Navigate to /message-view/:childId
    navigate(`/message-view/${childId}`);
  };

  // ----------------------------
  // Render Profile
  // ----------------------------
  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {childData.firstName} {childData.lastName}
          </h1>
          <p style={styles.description}>
            Phone: {childData.phoneNumber || "Not Provided"}
          </p>
          <p style={styles.description}>
            Email: {childData.email || "Not Provided"}
          </p>

          <div style={styles.actions}>
            <button style={styles.button} onClick={handleOpenChat}>
              <FaRegPaperPlane style={{ marginRight: "5px" }} /> Text Message
            </button>
            <button style={styles.button}>
              <FaVideo style={{ marginRight: "5px" }} /> Video Call
            </button>
            <button style={styles.button}>
              <FaPhone style={{ marginRight: "5px" }} /> Voice Call
            </button>
            <button style={styles.button}>
              <FaRegPaperPlane style={{ marginRight: "5px" }} /> Voice Note
            </button>
            <button style={styles.emergencyButton}>
              <FaExclamationTriangle style={{ marginRight: "5px" }} /> Emergency
            </button>
          </div>

          <button
            style={styles.backButton}
            onClick={() => navigate("/dad-dashboard")}
          >
            <FaArrowLeft style={{ marginRight: "5px" }} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;

// ----------------------------
// Inline Styles
// ----------------------------
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "black",
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "relative",
    zIndex: 1,
    margin: "0 auto",
    padding: "20px",
    maxWidth: "600px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(50, 50, 50, 0.85)",
    padding: "20px",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    color: "#fff",
  },
  title: {
    fontSize: "2rem",
    color: "#fff",
    marginBottom: "10px",
  },
  description: {
    color: "#ddd",
    fontSize: "1rem",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyButton: {
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    backgroundColor: "#f44336",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
  },
  backButton: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    backgroundColor: "#555",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

