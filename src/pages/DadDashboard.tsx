// src/pages/DadDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "./DadDashboard.css"; // Import DadDashboard-specific CSS
import AddChild from "../components/AddChild"; // Import AddChild component

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  // Add other child-specific fields as needed
}

const DadDashboard: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    draw();

    // Resize Handler
    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset drops on resize
      for (let i = 0; i < drops.length; i++) {
        drops[i] = 1;
      }
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  // Fetch children from Firestore
  useEffect(() => {
    const dadId = auth.currentUser?.uid;
    if (!dadId) {
      navigate("/login");
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, `users/${dadId}/children`),
      (snapshot) => {
        const fetchedChildren: Child[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Child[];
        setChildren(fetchedChildren);
        console.log("Fetched children:", fetchedChildren);
      },
      (error) => {
        console.error("Error fetching children:", error);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have been logged out.");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out.");
    }
  };

  const handleChildClick = (childId: string) => {
    navigate(`/child-profile/${childId}`);
  };

  return (
    <div className="dad-dashboard-wrapper">
      <canvas ref={canvasRef} className="dad-dashboard-matrix-canvas"></canvas>
      <div className="dad-dashboard-container">
        <h1 className="dad-dashboard-title">Dad Dashboard</h1>
        <button className="dad-dashboard-logout-button" onClick={handleLogout} aria-label="Logout Button">
          Logout
        </button>
        
        {/* AddChild Component */}
        <AddChild />

        <div className="dad-dashboard-children-list">
          {children.length > 0 ? (
            children.map((child) => (
              <div
                key={child.id}
                className="dad-dashboard-child-card"
                onClick={() => handleChildClick(child.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleChildClick(child.id);
                }}
              >
                <p>
                  {child.firstName} {child.lastName}
                </p>
                {/* Add more child details or actions here */}
              </div>
            ))
          ) : (
            <p>No children added yet. Use the form above to add a child.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DadDashboard;
