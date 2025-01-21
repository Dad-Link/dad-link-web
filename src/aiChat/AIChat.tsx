import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

interface Message {
  id: string;
  message: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const chatRef = collection(db, "aiChats");
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message || "(No message provided)", // Default message
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, "aiChats"), {
        message: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>AI Chat</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>{msg.message}</p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default AIChat;

