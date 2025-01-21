// src/Auth/Signup.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getFirestore, 
  serverTimestamp, 
  GeoPoint, 
  writeBatch 
} from 'firebase/firestore';
import { getStorage, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import "./Signup.css"; // Import Signup-specific CSS

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const canvasRef = useRef<HTMLCanvasElement>(null); // Use useRef for canvas

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D context not available");
      return;
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%".split("");
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("User created:", user.uid);

      // Generate UUIDs
      const NotificationsUUID = uuidv4();
      const chatUUID = uuidv4();
      const eventUUID = uuidv4();
      const locationUUID = uuidv4();
      const needUUID = uuidv4();
      const picUUID = uuidv4();
      const taskUUID = uuidv4();
      const videoChatUUID = uuidv4();
      const voiceCallUUID = uuidv4();
      const voiceNoteUUID = uuidv4();
      const wantUUID = uuidv4();

      // Define AiAssistance Categories
      const categories = [
        "Business",
        "Dinner and Cooking",
        "Emotional Support",
        "Finance",
        "Health",
        "Learning",
        "Motivation",
        "Navigation",
        "Personal",
        "Pets",
        "Space and Science",
        "Translation",
        "Transport",
        "Weather",
      ];

      // Prepare user data
      const userData = {
        ChatBackgroundStyle: 1,
        MainThemeStyle: 1,
        accountCreated: serverTimestamp(),
        accountStatus: "",
        cellularDataAllowed: true,
        dadAddress: "",
        dadUUID: uuidv4(), // Unique identifier for the dad
        dateOfBirth: "",
        email: formData.email,
        fcmToken: "",
        firstName: formData.firstName,
        isDad: true,
        isSilenced: false,
        lastName: formData.lastName,
        location: new GeoPoint(0, 0), // Default geopoint
        loginAttempts: 1,
        permissions: {
          analyticsConsent: true,
          cameraAccess: true,
          contactsAccess: true,
          darkModeEnabled: false,
          emailNotifications: true,
          locationAccess: true,
          microphoneAccess: true,
          pushNotifications: true,
          smsNotifications: false,
        },
        phoneNumber: formData.phoneNumber,
        profilePictureURL: "",
        textColorHex: "",
        uuids: {
          NotificationsUUID,
          chatUUID,
          eventUUID,
          locationUUID,
          needUUID,
          picUUID,
          taskUUID,
          videoChatUUID,
          voiceCallUUID,
          voiceNoteUUID,
          wantUUID,
        },
      };

      console.log("Saving user data to Firestore:", userData);

      // Initialize a batch for atomic writes
      const batch = writeBatch(db);

      // Reference to the user document
      const userDocRef = doc(db, "users", user.uid);
      batch.set(userDocRef, userData);

      // Initialize AiAssistance sub-collections with initial chats
      categories.forEach((category) => {
        const chatDocRef = doc(db, `users/${user.uid}/AiAssistance/${category}/chats`, "initialChat");
        batch.set(chatDocRef, {
          chatId: uuidv4(),
          messages: [],
          createdAt: serverTimestamp(),
          // Add other chat-specific fields as needed
        });
      });

      // Commit the batch to save user data and AiAssistance chats
      await batch.commit();
      console.log("User data and AiAssistance chats saved.");

      // Upload knowledge.json to Firebase Storage for each category
      for (const category of categories) {
        const knowledgeContent = JSON.stringify({
          // Preset or initial knowledge data for each category
          // Customize this as per your application's needs
          data: [],
          lastUpdated: new Date().toISOString(),
        }, null, 2);

        const storagePath = `KnowledgeBase/${user.uid}/${category}/knowledge.json`;
        const storageRefPath = ref(storage, storagePath);

        try {
          await uploadString(storageRefPath, knowledgeContent, 'raw', { contentType: 'application/json' });
          console.log(`knowledge.json uploaded to Storage at ${storagePath}`);

          // Optionally, save metadata in Firestore
          const knowledgeMetadataRef = doc(db, `users/${user.uid}/KnowledgeBase/${category}/metadata`);
          await setDoc(knowledgeMetadataRef, {
            storagePath,
            uploadedAt: serverTimestamp(),
            // Add other metadata fields if necessary
          });
          console.log(`Metadata for ${category} KnowledgeBase saved.`);
        } catch (err) {
          console.error(`Failed to upload knowledge.json for category ${category}:`, err);
          // Optionally, handle the error (e.g., retry, alert the user, etc.)
        }
      }

      // Provide a success message before navigating
      alert("Signup successful! Welcome to the Dad Dashboard.");

      // Navigate to Dashboard after successful signup
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(`Signup failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <div className="signup-container">
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>
      <div className="signup-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="signup-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="signup-input"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="signup-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="signup-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="signup-input"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="button-group">
            <button type="submit" disabled={isLoading} className="signup-button" aria-label="Sign Up Button">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <button type="button" onClick={goBack} className="back-button" aria-label="Go Back Button">
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

