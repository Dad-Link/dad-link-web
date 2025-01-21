import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AgoraRTC, { IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";

const APP_ID = process.env.REACT_APP_AGORA_APP_ID || "";
if (!APP_ID) {
  console.error("Missing Agora credentials in .env file.");
  throw new Error("Agora credentials are required.");
}

const ChildDashboard: React.FC = () => {
  const [showTextCard, setShowTextCard] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dadId, setDadId] = useState<string | null>(null);
  const [childUUID, setChildUUID] = useState<string | null>(null);

  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const childAuthId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchChildDoc = async () => {
      if (!childAuthId) {
        alert("No child is logged in. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const q = query(collectionGroup(db, "children"), where("firebaseChildId", "==", childAuthId));
        const snap = await getDocs(q);

        if (snap.empty) {
          alert("No child document found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const childDoc = snap.docs[0];
        const data = childDoc.data();
        setDadId(data.dadId || null);
        setChildUUID(data.childUUID || null);
      } catch (error) {
        console.error("Error fetching child document:", error);
        alert("Error loading child data.");
        navigate("/login");
      }
    };

    fetchChildDoc();
  }, [childAuthId, navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, x) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, x * fontSize, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSendText = async () => {
    if (!dadId || !childUUID) {
      alert("Missing dadId or childUUID. Cannot send message.");
      return;
    }
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    setIsSending(true);
    try {
      const messagesRef = collection(db, `users/${dadId}/children/${childUUID}/messages`);
      await addDoc(messagesRef, {
        text: message.trim(),
        senderId: childAuthId,
        timestamp: new Date(),
      });

      alert("Message sent successfully!");
      setMessage("");
      setShowTextCard(false);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      {/* Other JSX remains the same */}
    </div>
  );
};

export default ChildDashboard;


// ----------------------------
// Inline Styles
// ----------------------------
const styles = {
  wrapper: {
    position: "relative" as const,
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "black",
  },
  canvas: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  scrollContainer: {
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "20px",
    color: "#fff",
  },
  header: {
    marginBottom: "20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "12px 25px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  textCard: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as const,
    width: "80%",
    maxWidth: "400px",
  },
  textArea: {
    width: "100%",
    height: "100px",
    marginBottom: "10px",
    borderRadius: "5px",
    padding: "8px",
    fontSize: "1rem",
  },
  sendButton: {
    padding: "12px 25px",
    backgroundColor: "#28a745",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};
