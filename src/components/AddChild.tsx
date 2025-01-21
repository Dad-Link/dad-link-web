// src/components/AddChild.tsx
import React, { useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddChild: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleAddChild = async () => {
    const dadId = auth.currentUser?.uid;
    if (!dadId) {
      setError("User not authenticated.");
      return;
    }

    if (!firstName || !lastName) {
      setError("Please enter both first and last names.");
      return;
    }

    try {
      await addDoc(collection(db, `users/${dadId}/children`), {
        firstName,
        lastName,
        createdAt: serverTimestamp(),
        // Add other child-specific fields as needed
      });
      setFirstName("");
      setLastName("");
      setError("");
      alert("Child added successfully!");
    } catch (err) {
      console.error("Error adding child:", err);
      setError("Failed to add child. Please try again.");
    }
  };

  return (
    <div className="add-child-container">
      <h2>Add Child</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleAddChild}>Add Child</button>
    </div>
  );
};

export default AddChild;


